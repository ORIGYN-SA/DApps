import { Principal } from '@dfinity/principal';
import { getActor } from '@origyn/actor-reference';
import { IdlStandard, getIdl, getAccountId } from '@dapp/utils';
import type { Token } from './TokensContextProvider';

type BalanceResponse = {
  value: number;
  decimals?: number;
};

const getTokenActor = async (isLocal: boolean, token: Token, idlStandard: IdlStandard) => {
  const actor = await getActor<any>({
    canisterId: token.canisterId,
    idlFactory: getIdl(idlStandard),
    isLocal,
  });

  return actor;
};

const icpMethod = async (
  isLocal: boolean,
  account: string,
  token: Token,
): Promise<BalanceResponse> => {
  try {
    const actor = await getTokenActor(isLocal, token, IdlStandard.ICP);
    const balance: any = await actor.account_balance_dfx({ account });
    return { value: balance.e8s.toString(), decimals: 8 };
  } catch (e) {
    return {
      value: 0,
      decimals: 8,
    };
  }
};

const dip20Method = async (
  isLocal: boolean,
  principal: Principal,
  token: Token,
): Promise<BalanceResponse> => {
  const actor = await getTokenActor(isLocal, token, IdlStandard.DIP20);
  const value = parseFloat((await actor.balanceOf(principal)).toString());
  return { value, decimals: 8 };
};

const extMethod = async (
  isLocal: boolean,
  address: string,
  token: Token,
): Promise<BalanceResponse> => {
  const actor = await getTokenActor(isLocal, token, IdlStandard.EXT);
  const balanceResult: any = await actor.balance({
    token: token.symbol,
    user: { address },
  });

  if ('ok' in balanceResult) {
    return { value: balanceResult.ok.toString(), decimals: 8 };
  }

  throw new Error(Object.keys(balanceResult.err)[0]);
};

const xtcMethod = async (
  isLocal: boolean,
  principal: Principal,
  token: Token,
): Promise<BalanceResponse> => {
  const actor = await getTokenActor(isLocal, token, IdlStandard.XTC);
  const value = await actor.balance([principal]);
  return { value: parseFloat(value.toString()), decimals: 8 };
};

const wicpMethod = async (
  isLocal: boolean,
  principal: Principal,
  token: Token,
): Promise<BalanceResponse> => {
  const actor = await getTokenActor(isLocal, token, IdlStandard.WICP);
  const value = await actor.balanceOf(principal);
  return { value: parseFloat(value.toString()), decimals: 8 };
};

const ogyMethod = async (
  isLocal: boolean,
  principal: Principal,
  token: Token,
): Promise<BalanceResponse> => {
  const actor = await getTokenActor(isLocal, token, IdlStandard.OGY);
  const value: any = await actor.icrc1_balance_of({
    owner: principal,
    subaccount: [],
  });
  return { value: parseFloat(value?.toString()), decimals: 8 };
};

export const getBalance = async (isLocal: boolean, principal: Principal, token: Token) => {
  switch (token.standard) {
    case IdlStandard.ICP:
      return icpMethod(isLocal, getAccountId(principal), token);
    case IdlStandard.DIP20:
      return dip20Method(isLocal, principal, token);
    case IdlStandard.EXT:
      return extMethod(isLocal, getAccountId(principal), token);
    case IdlStandard.WICP:
      return wicpMethod(isLocal, principal, token);
    case IdlStandard.XTC:
      return xtcMethod(isLocal, principal, token);
    case IdlStandard.OGY:
      return ogyMethod(isLocal, principal, token);
  }
};

export const getBalanceByAccount = async (isLocal: boolean, account: string, token: Token) => {
  switch (token.standard) {
    case IdlStandard.ICP:
      return icpMethod(isLocal, account, token);
    case IdlStandard.EXT:
      return extMethod(isLocal, account, token);
  }
};
