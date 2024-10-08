// src/data/canisters/logoCanister.ts

import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../interfaces/icpswap/info.did';
import { _SERVICE as _ICSWAP_INFO } from '../interfaces/icpswap/info.ts';

const LOGO_CANISTER_ID = 'k37c6-riaaa-aaaag-qcyza-cai';

const agent = new HttpAgent({ host: 'https://ic0.app' });

export const icpswapInfoActor = Actor.createActor<_ICSWAP_INFO>(idlFactory, {
  agent,
  canisterId: LOGO_CANISTER_ID,
});
