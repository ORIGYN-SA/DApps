/* eslint-disable import/extensions */
// src/data/canisters/logoCanister.ts

import { Actor, HttpAgent } from '@dfinity/agent'
import { idlFactory } from '../icpswap/info.did.js'
import { _SERVICE as _ICSWAP_INFO } from '../icpswap/info.ts'
import { LOGO_CANISTER_ID } from '@dapp/common-constants'

const canisterId = LOGO_CANISTER_ID

const agent = new HttpAgent({ host: 'https://ic0.app' })

if (!canisterId) {
  throw new Error('LOGO_CANISTER_ID is undefined.')
}

export const icpswapInfoActor = Actor.createActor<_ICSWAP_INFO>(idlFactory, {
  agent,
  canisterId,
})
