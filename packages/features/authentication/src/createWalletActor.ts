import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { IdlStandard, getIdl } from '@dapp/utils';

const plugActor = async (canisterId: string, standard: IdlStandard) => {
  if (!(await window.ic.plug.isConnected())) {
    return undefined;
  }

  await window.ic.plug.createAgent({
    whitelist: [canisterId],
    host: 'https://boundary.ic0.app',
  });

  const actor = await window.ic.plug.createActor({
    canisterId: canisterId,
    interfaceFactory: getIdl(standard),
  });
  return actor;
};

const iiActor = async (canisterId: string, standard: IdlStandard) => {
  const authClient = await AuthClient.create();
  if (!(await authClient.isAuthenticated())) {
    return undefined;
  }

  const identity = authClient.getIdentity();

  const airdropAgent = new HttpAgent({
    identity,
    host: 'https://boundary.ic0.app/',
  });

  const actor = Actor.createActor(getIdl(standard), {
    agent: airdropAgent,
    canisterId: canisterId,
  });

  return actor;
};

export const createWalletActor = async (
  walletType: string,
  canisterId: string,
  standard: IdlStandard,
) => {
  switch (walletType) {
    case 'plug':
      return await plugActor(canisterId, standard);
    case 'ii':
      return await iiActor(canisterId, standard);
  }
};
