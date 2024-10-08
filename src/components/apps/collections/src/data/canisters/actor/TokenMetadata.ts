import { Actor, HttpAgent, ActorSubclass } from '@dfinity/agent';
import { idlFactory as tokenMetadataIdlFactory } from '../interfaces/tokens/info.did';
import { _SERVICE as TokenMetadataService } from '../interfaces/tokens/info';

export const createTokenMetadataActor = (
  canisterId: string,
): ActorSubclass<TokenMetadataService> => {
  const agent = new HttpAgent({ host: 'https://ic0.app' });

  return Actor.createActor<TokenMetadataService>(tokenMetadataIdlFactory, {
    agent,
    canisterId,
  });
};
