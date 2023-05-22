// TODO: The actor calls in these functions should be replaced with mintjs
import * as React from 'react';
import { useContext } from 'react';
import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import { AuthContext } from '@dapp/features-authentication';
import { sendTransaction, Token } from '@dapp/features-tokens-provider';
import { useDebug } from '@dapp/features-debug-provider';
import M, {
  getNftCollectionMeta as _getNftCollectionMeta,
  acceptEscrow as _acceptEscrow,
  rejectEscrow as _rejectEscrow,
  withdrawEscrow as _withdrawEscrow,
  Account,
  SaleInfoRequest,
} from '@origyn/mintjs';
import { OrigynClient } from '@origyn/mintjs';
import { PerpetualOSContext } from '@dapp/features-context-provider';
import { Actor } from '@dfinity/agent';
export interface ActorResult<T> {
  result?: T;
  errorMessage?: string;
}

/** UTILITY FUNCTIONS */
const getErrorText = (error: any, defaultMessage?: string) => {
  return error?.text || defaultMessage || 'Unexpected error';
};

const convertEscrow = (escrow: M.EscrowRecord): M.EscrowActionArgs => {
  return {
    token_id: escrow.token_id,
    amount: escrow.amount,
    buyer: escrow.buyer,
    seller: escrow.seller,
    /*@ts-ignore*/
    ic_token: escrow.token.ic,
  };
};

const logAgentInfo = (actor: Actor) => {
  if (actor) {
    let actorCanisterId = Actor.canisterIdOf(actor).toText();
    let agent = Actor.agentOf(actor);
    console.log('actor canister id', actorCanisterId);
    console.log('agent', agent);
  } else {
    console.log('actor is null');
  }
};

/** HOOK WITH WRAPPER FUNCTIONS FOR MINTJS */
export const useApi = () => {
  const debug = useDebug();
  const { actor, principal, activeWalletProvider } = React.useContext(AuthContext);
  const context = useContext(PerpetualOSContext);

  OrigynClient.getInstance().init(!context.isLocal, context.canisterId, { actor });

  const getNftCollectionMeta = async (): Promise<M.CollectionInfo> => {
    const r = await _getNftCollectionMeta();
    debug.log('getNftCollectionMeta result', r);

    if ('err' in r) {
      console.error(r.err);
      logAgentInfo(actor);
      throw new Error('Unable to retrieve collection metadata.');
    }

    return r.ok;
  };

  const getNftBatch = async (tokenIds: string[]): Promise<M.NFTInfoStable[]> => {
    const r = await actor?.nft_batch_origyn(tokenIds);

    const error = r.find((m) => 'err' in m);
    if (error) {
      console.error(error);
      logAgentInfo(actor);
      throw new Error('Unable to retrieve metadata of tokens.');
    }

    return r.map((m) => 'ok' in m && m.ok).filter((m) => !!m);
  };

  const getNftBalances = async (principal: Principal): Promise<M.BalanceResponse> => {
    const account: Account = { principal };
    const response = await actor.balance_of_nft_origyn(account);
    debug.log('balance_of_nft_origyn response', response);

    if ('err' in response) {
      console.log(response.err);
      logAgentInfo(actor);
      throw new Error(response.err.text || 'Unable to get NFT balances.');
    } else {
      return response.ok;
    }
  };

  const getNftSaleInfo = async (): Promise<M.SaleInfoResponse> => {
    const active: SaleInfoRequest = {
      active: [],
    };
    const response = await actor.sale_info_nft_origyn(active);
    debug.log('sale_info_nft_origyn response', response);

    if ('err' in response) {
      debug.log(response.err);
      logAgentInfo(actor);
      throw new Error(response.err.text || 'Unable to get NFT sale info.');
    } else {
      return response.ok;
    }
  };

  const getNftsHistory = async (
    activeAttendedAuctions: M.AuctionStateStable[],
  ): Promise<M.TransactionRecord[]> => {
    const activeTokens: [string, [] | [bigint], [] | [bigint]][] = activeAttendedAuctions.map(
      (auction): [string, [] | [bigint], [] | [bigint]] => {
        return [auction.current_escrow[0].token_id, [], []];
      },
    );
    try {
      const response = await actor.history_batch_nft_origyn(activeTokens);

      if (
        Array.isArray(response) &&
        response.length > 0 &&
        ('err' in response[0] || 'ok' in response[0])
      ) {
        if ('err' in response[0]) {
          debug.log(response[0].err);
          throw new Error(response[0].err.text || 'Unable to get NFT history info.');
        } else {
          const activeNftHistory = response[0].ok;
          return activeNftHistory;
        }
      } else {
        throw new Error('Invalid response received from history_batch_origyn.');
      }
    } catch (e) {
      throw new Error(e);
    }
  };

  const getDepositAccountNumber = async (): Promise<ActorResult<string>> => {
    const genericErrorMessage = 'Failed to get deposit account';

    try {
      // gets the deposit info for the account number of the caller
      const response = await actor.sale_info_nft_origyn({ deposit_info: [] });
      debug.log('sale_info_nft_origyn response', response);

      if ('err' in response) {
        console.error(response.err);
        return { errorMessage: response.err?.[0] || genericErrorMessage };
      }

      if (!('deposit_info' in response.ok)) {
        debug.log(response.ok);
        return { errorMessage: 'Deposit info not found in sale info' };
      }

      const result: M.SaleInfoResponse = response.ok;

      let accountId = '';
      if ('deposit_info' in result) {
        accountId = result.deposit_info.account_id_text;
      }

      if (accountId) {
        return {
          result: accountId,
        };
      } else {
        return { errorMessage: 'Account ID not found in sale info' };
      }
    } catch (e) {
      return { errorMessage: genericErrorMessage };
    }
  };

  const sendTokensToDepositAccount = async (
    accountId: string,
    totalAmount: BigNumber,
    token: Token,
  ): Promise<ActorResult<bigint>> => {
    // Transfer money from buyer's wallet to the deposit account
    // This will charge a tx fee to the buyer's wallet (first tx fee)
    // separate from the second tx fee included in the total escrow amount.
    const genericErrorMessage = 'Failed to send tokens to deposit account';
    try {
      const sendTransactionResult = await sendTransaction(
        activeWalletProvider,
        token,
        accountId,
        totalAmount,
      );

      if (sendTransactionResult.err) {
        console.error(sendTransactionResult.err);
        if (sendTransactionResult.err.toString().includes('InsufficientFunds')) {
          return { errorMessage: 'Insufficient funds' };
        } else {
          return { errorMessage: genericErrorMessage };
        }
      }

      const transactionHeight = BigInt(sendTransactionResult.ok);
      return { result: transactionHeight };
    } catch (e) {
      console.error(e);
      return { errorMessage: genericErrorMessage };
    }
  };

  const sendEscrow = async (
    token: Token,
    totalAmount: BigNumber,
    transactionHeight: bigint,
    tokenId: string,
    ownerPrincipalId: string,
    saleId?: string,
  ): Promise<ActorResult<M.EscrowReceipt>> => {
    const genericErrorMessage =
      'Failed to send escrow. Withdraw your tokens from Manage Deposits in your Vault.';

    try {
      const escrowData: M.EscrowRequest = {
        token_id: tokenId,
        deposit: {
          token: {
            ic: {
              id: [],
              fee: [BigInt(token.fee)],
              decimals: BigInt(token.decimals),
              canister: Principal.fromText(token.canisterId),
              standard: { Ledger: null },
              symbol: token.symbol,
            },
          },
          trx_id: [{ nat: BigInt(transactionHeight) }],
          seller: { principal: Principal.fromText(ownerPrincipalId) },
          buyer: { principal },
          amount: BigInt(totalAmount.toString()),
          sale_id: saleId ? [saleId] : [],
        },
        lock_to_date: [],
      };
      debug.log('escrowData', escrowData);

      const response = await actor.sale_nft_origyn({ escrow_deposit: escrowData });
      debug.log('sale_nft_origyn response', response);

      if ('err' in response) {
        console.error(response.err);
        return { errorMessage: genericErrorMessage };
      }

      const result: M.ManageSaleResponse = response.ok;
      if ('escrow_deposit' in result && result.escrow_deposit.receipt) {
        return { result: result.escrow_deposit.receipt };
      } else {
        return { errorMessage: 'Escrow sent, but no escrow receipt was returned' };
      }
    } catch (e) {
      console.error(e);
      return { errorMessage: genericErrorMessage };
    }
  };

  const acceptEscrow = async (escrow: M.EscrowRecord): Promise<M.MarketTransferRequestReponse> => {
    const r = await _acceptEscrow(convertEscrow(escrow));
    if (r.err) {
      throw new Error(getErrorText(r.err, 'Accept escrow failed'));
    }
    return r.ok;
  };

  const withdrawEscrow = async (escrow: M.EscrowRecord): Promise<M.ManageSaleResponse> => {
    const r = await _withdrawEscrow(convertEscrow(escrow));
    if (r.err) {
      throw new Error(getErrorText(r.err, 'Withdraw escrow failed'));
    }
    return r.ok;
  };

  const rejectEscrow = async (escrow: M.EscrowRecord): Promise<M.ManageSaleResponse> => {
    const r = await _rejectEscrow(convertEscrow(escrow));
    if (r.err) {
      throw new Error(getErrorText(r.err, 'Reject escrow failed'));
    }
    return r.ok;
  };

  const createBid = async (
    escrowReceipt: M.EscrowReceipt,
    saleId: string,
  ): Promise<ActorResult<M.ManageSaleResponse>> => {
    const genericErrorMessage = 'Failed to create bid after tokens were sent to escrow';

    try {
      // if the ODC is on auction, then this is a bid in the auction
      const bidRequest: M.BidRequest = {
        broker_id: [],
        escrow_receipt: escrowReceipt,
        sale_id: saleId,
      };
      debug.log('bidRequest', bidRequest);

      const response = await actor.sale_nft_origyn({ bid: bidRequest });
      debug.log('sale_nft_origyn response', response);

      if ('err' in response) {
        console.error(response.err);
        return { errorMessage: genericErrorMessage };
      }

      return { result: response.ok };
    } catch (e) {
      console.error(e);
      return { errorMessage: genericErrorMessage };
    }
  };

  return {
    getNftCollectionMeta: getNftCollectionMeta,
    getNftBatch,
    getNftBalances,
    getDepositAccountNumber,
    sendTokensToDepositAccount,
    sendEscrow,
    acceptEscrow,
    rejectEscrow,
    withdrawEscrow,
    createBid,
    getNftSaleInfo,
    getNftsHistory,
  };
};
