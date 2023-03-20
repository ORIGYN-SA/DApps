// TODO: The actor calls in these functions should be replaced with mintjs
import * as React from 'react';
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

export interface ActorResult<T> {
  result?: T;
  errorMessage?: string;
}

/** UTILITY FUNCTIONS */
const getErrorText = (error: any, defaultMessage?: string) => {
  return error?.text || defaultMessage || 'Unexpected error';
};

const convertToken = (token: M.TokenSpec): M.IcTokenType => {
  if (!('ic' in token)) {
    throw new Error('Extensible tokens are not currently supported');
  }

  const getStandard = () => {
    if ('Ledger' in token.ic.standard) {
      return { Ledger: null };
    } else if ('ICRC1' in token.ic.standard) {
      return { ICRC1: null };
    } else if ('EXTFungible' in token.ic.standard) {
      return { EXTFungible: null };
    } else if ('DIP20' in token.ic.standard) {
      return { DIP20: null };
    }
  };

  if (token)
    return {
      fee: token.ic.fee,
      decimals: token.ic.decimals,
      canister: token.ic.canister,
      standard: getStandard(),
      symbol: token.ic.symbol,
    };
};

const convertAccount = (account: M.Account): M.AccountType => {
  return {
    account_id: 'account_id' in account && account.account_id,
    principal: 'principal' in account && account.principal,
    extensible: 'extensible' in account && account.extensible,
    account: 'account' in account && {
      of: account.account.owner,
      sub_account: account.account.sub_account?.[0] || [],
    },
  };
};

const convertEscrow = (escrow: M.EscrowRecord): M.EscrowActionArgs => {
  return {
    token_id: escrow.token_id,
    amount: escrow.amount,
    buyer: convertAccount(escrow.buyer),
    seller: convertAccount(escrow.seller),
    ic_token: convertToken(escrow.token),
  };
};

/** HOOK WITH WRAPPER FUNCTIONS FOR MINTJS */
export const useApi = () => {
  const debug = useDebug();
  const { actor, principal, activeWalletProvider } = React.useContext(AuthContext);

  const getNftCollectionMeta = async (): Promise<M.CollectionInfo> => {
    const r = await _getNftCollectionMeta();
    debug.log('getNftCollectionMeta result', r);

    if ('err' in r) {
      console.error(r.err);
      throw new Error('Unable to retrieve collection metadata.');
    }

    return r.ok;
  };

  const getNftBatch = async (tokenIds: string[]): Promise<M.NFTInfoStable[]> => {
    const r = await actor?.nft_batch_origyn(tokenIds);

    const error = r.find((m) => 'err' in m);
    if (error) {
      console.error(error);
      throw new Error('Unable to retrieve metadata of tokens.');
    }

    return r.map((m) => 'ok' in m && m.ok).filter((m) => !!m);
  };

  const getNftBalances = async (principal: Principal): Promise<M.BalanceResponse> => {
    const account: Account = { principal };
    const response = await actor.balance_of_nft_origyn(account);
    debug.log('balance_of_nft_origyn response', response);

    if ('err' in response) {
      debug.log(response.err);
      // TODO: Implement this pattern in all mintjs/actor calls to shows canister
      // error first, then default error message, but use ERROR constants instead.
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
      throw new Error(response.err.text || 'Unable to get NFT sale info.');
    } else {
      return response.ok;
    }
  };

  const getActiveAuctions = async (saleInfo: M.SaleInfoResponse): Promise<M.AuctionStateStable[]> => {

    if ('active' in saleInfo) {
      const activeSalesRecords = saleInfo.active.records
        .map((record) => {
          return record[1];
        }).filter((record) => record.length > 0);

      if (activeSalesRecords.length > 0) {
        const activeAuctions = activeSalesRecords
          .map((record) => {
            if ('auction' in record[0].sale_type) {
              return record[0].sale_type.auction;
            }
          }).filter((auction) => auction !== undefined);
        return activeAuctions;
      }
    };
  };

  const getActiveAttendedAuctions = (principal: Principal, activeAuctions: M.AuctionStateStable[]): M.AuctionStateStable[] => {
    if (activeAuctions.length > 0) {
      const activeAttendedAuctions = activeAuctions.filter((auctionState) => {
        return auctionState.participants.some(
          (participant) => participant[0].toText() === principal.toText(),
        );
      });
      return activeAttendedAuctions;
    }
  };

  const getActiveNftHistory = async (activeAttendedAuctions: M.AuctionStateStable[]): Promise<M.TransactionRecord[]> => {

    const activeTokens: [string, [] | [bigint], [] | [bigint]][] = activeAttendedAuctions.map(
      (auction): [string, [] | [bigint], [] | [bigint]] => {
        return [auction.current_escrow[0].token_id, [], []];
      }
    );

    const response = await actor.history_batch_nft_origyn(activeTokens);
    if ("err" in response[0]) {
      debug.log(response[0].err);
      throw new Error(response[0].err.text || 'Unable to get NFT history info.');
    } else {
      const activeNftHistory = response[0].ok;
      return activeNftHistory;
    }

  };

  const getActiveAttendedAuctionsTx = (activeAttendedAuctions: M.TransactionRecord[],): M.TransactionRecord[] => {
    if (activeAttendedAuctions.length > 0) {
      return activeAttendedAuctions
        .flat()
        .filter(
          (record) =>
            'auction_bid' in record.txn_type &&
            'buyer' in record.txn_type.auction_bid &&
            'principal' in record.txn_type.auction_bid.buyer &&
            record.txn_type.auction_bid.buyer.principal.toText() === principal.toText(),
        );
    };
  };

  const getHighestSentBids = (attendedAuctionsTx: M.TransactionRecord[]): M.TransactionRecord[] => {
    const bidsTokenIds = new Map<string, M.TransactionRecord>();
    for (const txRecord of attendedAuctionsTx) {
      const auctionBid = ('auction_bid' in txRecord.txn_type) ? txRecord.txn_type.auction_bid : null;
      if (auctionBid) {
        const token = txRecord.token_id;
        if (!bidsTokenIds.has(token) || txRecord.timestamp > bidsTokenIds.get(token)!.timestamp) {
          bidsTokenIds.set(token, txRecord);
        }
      }
    }
    return Array.from(bidsTokenIds.values());
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
        console.log(response.ok);
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
        false,
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
              fee: BigInt(token.fee),
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
    getActiveAuctions,
    getActiveAttendedAuctions,
    getActiveNftHistory,
    getActiveAttendedAuctionsTx,
    getHighestSentBids,
  };
};
