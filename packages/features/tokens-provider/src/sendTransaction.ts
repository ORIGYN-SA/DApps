import { getIdl, IdlStandard } from '@dapp/utils';
import { Principal } from '@dfinity/principal';
import { Token } from './TokensContextProvider';
import { getAccountId } from '@dapp/utils';
import { toHex } from '@dfinity/agent/lib/esm/utils/buffer';

// OGY and ICP
const sendICP = async (actor: any, token: Token, to: any, amount: number, memo?: number) => {
  const defaultArgs = {
    fee: token?.symbol === 'OGY' ? BigInt(200_000) : BigInt(10_000),
    memo: BigInt(0),
  };

  try {
    const response = await actor.send_dfx({
      to:
        // @ts-ignore
        typeof to === 'string' ? getAccountId(Principal.fromText(to)) : toHex(to),
      fee: { e8s: token?.fee || defaultArgs.fee },
      amount: { e8s: BigInt(amount) },
      memo: defaultArgs.memo,
      from_subaccount: [],
      created_at_time: [],
    });

    return response.toString();
  } catch (e) {
    throw Error(e.message);
  }
};

// DIP20 and WICP
export const sendWICP = async (actor: any, to: any, amount: number, memo?: number) => {
  const transferResult = await actor.transfer(
    typeof to === 'string' ? Principal.fromText(to) : to,
    BigInt(amount),
  );

  if ('Ok' in transferResult) return transferResult.Ok.toString();

  throw new Error(Object.keys(transferResult.Err)[0]);
};
export const sendXTC = async (actor: any, to: any, amount: number, memo?: number) => {
  const transferResult = await actor.transferErc20(
    typeof to === 'string' ? Principal.fromText(to) : to,
    BigInt(amount),
  );

  if ('Ok' in transferResult) return transferResult.Ok.toString();

  throw new Error(Object.keys(transferResult.Err)[0]);
};
export const sendEXT = async (actor: any, token: Token, to: any, from: string, amount: number, memo?: number) => {
  const dummyMemmo = new Array(32).fill(0);
  const _to = typeof to === 'string' ? { principal: Principal.fromText(to) } : { account_id: to };

  const data = {
    to: _to,
    from: { principal: Principal.from(from) },
    amount: BigInt(amount),
    token: token.symbol,
    memo: dummyMemmo,
    notify: false,
    subaccount: [],
    fee: BigInt(0),
  };

  const transferResult = await actor.transfer(data);

  if ('ok' in transferResult) return transferResult.ok.toString();

  throw new Error(Object.keys(transferResult.err)[0]);
};
export const sendTransaction = async (
  isLocal: boolean,
  activeWalletProvider: any,
  token: Token,
  to: any,
  amount: number,
  memo?: number,
  from?: string,
) => {
  const ledgerCanisterId = isLocal ? token.localCanisterId : token.canisterId;
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
