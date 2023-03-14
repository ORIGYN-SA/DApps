// TODO: The actor calls in these functions should be replaced with mintjs
import * as React from 'react';
import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import { AuthContext } from '@dapp/features-authentication';
import { sendTransaction, Token } from '@dapp/features-tokens-provider';
import { useDebug } from '@dapp/features-debug-provider';
import {
  ManageSaleResponse,
  EscrowReceipt,
  SaleInfoResponse,
  BidRequest,
  BidResponse,
} from '@dapp/common-types';

export interface ActorResult<T> {
  result?: T;
  errorMessage?: string;
}

export function useApi() {
  const debug = useDebug();
  const { actor, principal, activeWalletProvider } = React.useContext(AuthContext);

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

      const result: SaleInfoResponse = response.ok;

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
  ): Promise<ActorResult<BigInt>> => {
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
    transactionHeight: BigInt,
    tokenId: string,
    ownerPrincipalId: string,
    saleId?: string,
  ): Promise<ActorResult<EscrowReceipt>> => {
    const genericErrorMessage =
      'Failed to send escrow. Withdraw your tokens from Manage Deposits in your Vault.';

    try {
      const escrowData = {
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
          trx_id: [{ nat: transactionHeight }],
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

      const result: ManageSaleResponse = response.ok;
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

  const createBid = async (
    escrowReceipt: EscrowReceipt,
    saleId: string,
  ): Promise<ActorResult<BidResponse>> => {
    const genericErrorMessage = 'Failed to create bid after tokens were sent to escrow';

    try {
      // if the ODC is on auction, then this is a bid in the auction
      const bidRequest: BidRequest = {
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

      return { result: response.ok as BidResponse };
    } catch (e) {
      console.error(e);
      return { errorMessage: genericErrorMessage };
    }
  };

  return { getDepositAccountNumber, sendTokensToDepositAccount, sendEscrow, createBid };
}
