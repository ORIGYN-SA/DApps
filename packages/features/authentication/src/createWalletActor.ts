import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { getIdl } from '@dapp/utils';
import { Token } from '../../tokens-provider/src/TokensContextProvider';
declare global {
  interface Window {
    ic?: any;
  }
}
const plugActor = async (localDeveopment: boolean, token: Token) => {
  if (!(await window.ic.plug.isConnected())) {
    return undefined;
  }
  const ledgerCanisterId = localDeveopment ? token.localCanisterId : token.canisterId;
  console.log(
    '🚀 ~ file: createWalletActor.ts ~ line 15 ~ plugActor ~ ledgerCanisterId',
    ledgerCanisterId,
  );
  await window.ic.plug.createAgent({
    whitelist: [ledgerCanisterId],
    host: localDeveopment ? 'http://localhost:8000' : 'https://boundary.ic0.app',
  });

  const actor = await window.ic.plug.createActor({
    canisterId: ledgerCanisterId,
    interfaceFactory: getIdl(token.standard),
  });
  console.log('🚀 ~ file: createWalletActor.ts ~ line 25 ~ plugActor ~ actor', actor);
  return actor;
};

const iiActor = async (localDeveopment: boolean, token: Token) => {
  const authClient = await AuthClient.create();
  if (!(await authClient.isAuthenticated())) {
    return undefined;
  }

  const identity = authClient.getIdentity();

  const airdropAgent = new HttpAgent({
    identity,
    host: localDeveopment ? 'http://localhost:8000' : 'https://boundary.ic0.app',
  });
  const ledgerCanisterId = localDeveopment ? token.localCanisterId : token.canisterId;

  const actor = Actor.createActor(getIdl(token.standard), {
    agent: airdropAgent,
    canisterId: ledgerCanisterId,
  });

  return actor;
};

export const createWalletActor = async (
  localDevelopment: boolean,
  walletType: string,
  token: Token,
) => {
  switch (walletType) {
    case 'plug':
      return await plugActor(localDevelopment, token);
    case 'ii':
      return await iiActor(localDevelopment, token);
  }
};
