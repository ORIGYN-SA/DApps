import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { IdlStandard, getIdl, getAccountId } from '@dapp/utils';
import { Token } from './TokensContextProvider';

const ROSETTA_URL = 'https://rosetta-api.internetcomputer.org';

const NET_ID = {
  blockchain: 'Internet Computer',
  network: '00000000000000020101',
};

type BalanceResponse = {
  value: number;
  decimals?: number;
};

const createAgent = (isLocal: boolean) =>
  new HttpAgent({
    host: isLocal ? 'http://localhost:8000' : 'https://boundary.ic0.app/',
  });

const icpMethod = async (isLocal: boolean, principal: Principal): Promise<BalanceResponse> => {
  const accountId = getAccountId(principal);
  const response = await fetch(`${ROSETTA_URL}/account/balance`, {
    method: 'POST',
    body: JSON.stringify({
      network_identifier: NET_ID,
      account_identifier: {
        address: accountId,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
  });
  if (!response.ok) {
    return { value: 0 };
  }
  const { balances } = await response.json();
  const [{ value, currency }] = balances;
  return { value, decimals: currency.decimals };
};

const dip20Method = async (
  isLocal: boolean,
  principal: Principal,
  token: Token,
): Promise<BalanceResponse> => {
  const actor = Actor.createActor(getIdl(IdlStandard.DIP20), {
    canisterId: isLocal ? token.localCanisterId : token.canisterId,
    agent: createAgent(isLocal),
  });
  const value = parseFloat((await actor.balanceOf(principal)).toString());
  return { value, decimals: 8 };
};

const extMethod = async (
  isLocal: boolean,
  principal: Principal,
  token: Token,
): Promise<BalanceResponse> => {
  const actor = Actor.createActor(getIdl(IdlStandard.EXT), {
    canisterId: isLocal ? token.localCanisterId : token.canisterId,
    agent: createAgent(isLocal),
  });
  const balanceResult: any = await actor.balance({
    token: isLocal ? token.localCanisterId : token.canisterId,
    user: { principal: principal },
  });
  if ('ok' in balanceResult) return { value: balanceResult.ok.toString(), decimals: 8 };

  throw new Error(Object.keys(balanceResult.err)[0]);
};

const xtcMethod = async (
  isLocal: boolean,
  principal: Principal,
  token: Token,
): Promise<BalanceResponse> => {
  const actor = Actor.createActor(getIdl(IdlStandard.XTC), {
    canisterId: isLocal ? token.localCanisterId : token.canisterId,
    agent: createAgent(isLocal),
  });
  const value = await actor.balance([principal]);
  return { value: parseFloat(value.toString()), decimals: 8 };
};

const wicpMethod = async (
  isLocal: boolean,
  principal: Principal,
  token: Token,
): Promise<BalanceResponse> => {
  const actor = Actor.createActor(getIdl(IdlStandard.WICP), {
    canisterId: isLocal ? token.localCanisterId : token.canisterId,
    agent: createAgent(isLocal),
  });
  const value = await actor.balanceOf(principal);
  return { value: parseFloat(value.toString()), decimals: 8 };
};

const ogyMethod = async (
  isLocal: boolean,
  principal: Principal,
  token: Token,
): Promise<BalanceResponse> => {
  const actor = Actor.createActor(getIdl(IdlStandard.ICP), {
    canisterId: isLocal ? token.localCanisterId : token.canisterId,
    agent: createAgent(isLocal),
  });
  const account = getAccountId(principal);

  const value: any = await actor.account_balance_dfx({
    account,
    token: token.symbol,
  });
  console.log('🚀 ~ file: getBalance.ts ~ line 118 ~ value', value);
  return { value: parseFloat(value?.e8s?.toString()), decimals: 8 };
};

export const getBalance = async (isLocal: boolean, principal: Principal, token: Token) => {
  switch (token.standard) {
    case IdlStandard.ICP:
      if (token.symbol === 'OGY') return ogyMethod(isLocal, principal, token);
      return icpMethod(isLocal, principal);
    case IdlStandard.DIP20:
      return dip20Method(isLocal, principal, token);
    case IdlStandard.EXT:
      return extMethod(isLocal, principal, token);
    case IdlStandard.WICP:
      return wicpMethod(isLocal, principal, token);
    case IdlStandard.XTC:
      return xtcMethod(isLocal, principal, token);
  }
};
