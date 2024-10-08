import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../interfaces/icpswap/store.did';
import { _SERVICE as _ICSWAP_STORE } from '../interfaces/icpswap/store.ts';

const ICPSWAP_CANISTER_ID = 'ggzvv-5qaaa-aaaag-qck7a-cai';

const agent = new HttpAgent({ host: 'https://ic0.app' });

export const icpswapStoreActor = Actor.createActor<_ICSWAP_STORE>(idlFactory, {
  agent,
  canisterId: ICPSWAP_CANISTER_ID,
});
