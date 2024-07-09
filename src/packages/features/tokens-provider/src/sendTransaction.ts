import BigNumber from 'bignumber.js';
import { getIdl, IdlStandard } from '@dapp/utils';
import { Principal } from '@dfinity/principal';
import type { Token } from './TokensContextProvider';

// OGY and ICP
const sendICP = async (actor: any, token: Token, to: string, amount: BigNumber, memo?: number) => {
  const defaultArgs = {
    fee: token?.symbol === 'OGY' ? BigInt(200_000) : BigInt(10_000),
    memo: BigInt(0),
  };

  try {
    const response = await actor.send_dfx({
      to,
      fee: { e8s: token?.fee || defaultArgs.fee },
      amount: { e8s: BigInt(amount.toString()) },
      memo: memo || defaultArgs.memo,
      from_subaccount: [],
      created_at_time: [],
    });

    return response.toString();
  } catch (e) {
    throw Error(e.message);
  }
};

// DIP20 and WICP
export const sendWICP = async (actor: any, to: string, amount: BigNumber, memo?: number) => {
  const transferResult = await actor.transfer(to, BigInt(amount.toString()));

  if ('Ok' in transferResult) return transferResult.Ok.toString();

  throw new Error(Object.keys(transferResult.Err)[0]);
};

export const sendXTC = async (actor: any, to: string, amount: BigNumber, memo?: number) => {
  const transferResult = await actor.transferErc20(to, BigInt(amount.toString()));

  if ('Ok' in transferResult) return transferResult.Ok.toString();

  throw new Error(Object.keys(transferResult.Err)[0]);
};

export const sendEXT = async (
  actor: any,
  token: Token,
  to: string,
  from: string,
  amount: BigNumber,
  memo?: number,
) => {
  const dummyMemmo = new Array(32).fill(0);
  const data = {
    to: { account_id: to },
    from: { principal: Principal.from(from) },
    amount: BigInt(amount.toString()),
    token: token.symbol,
    memo: dummyMemmo,
    notify: false,
    subaccount: [],
    fee: BigInt(0),
  };

  const transferResult = await actor.transfer(data);

  if ('ok' in transferResult) {
    return transferResult.ok.toString();
  }

  throw new Error(Object.keys(transferResult.err)[0]);
};

export const sendTransaction = async (
  activeWalletProvider: any,
  token: Token,
  to: string,
  amount: BigNumber,
  memo?: number,
  from?: string,
) => {
  const ledgerCanisterId = token.canisterId;
  const ledgerIdl = getIdl(token.standard);
  const { value: actor } = await activeWalletProvider.createActor(ledgerCanisterId, ledgerIdl);
  try {
    switch (token.standard) {
      case IdlStandard.ICP:
        return { ok: await sendICP(actor, token, to, amount, memo) };
      case IdlStandard.WICP:
      case IdlStandard.DIP20:
        return { ok: await sendWICP(actor, to, amount, memo) };
      case IdlStandard.XTC:
        return { ok: await sendXTC(actor, to, amount, memo) };
      case IdlStandard.EXT:
        return { ok: await sendEXT(actor, token, to, from, amount, memo) };
    }
  } catch (e) {
    return { err: e.message };
  }
};
