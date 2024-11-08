/* eslint-disable import/extensions */
import { Actor, HttpAgent } from '@dfinity/agent'
import { idlFactory } from '../icpswap/store.did.js'
import { _SERVICE as _ICSWAP_STORE } from '../icpswap/store.ts'
import { ICPSWAP_TOKENS_CANISTER_ID } from '@dapp/common-constants'

const canisterId = ICPSWAP_TOKENS_CANISTER_ID

const agent = new HttpAgent({ host: 'https://ic0.app' })

export const icpswapStoreActor = Actor.createActor<_ICSWAP_STORE>(idlFactory, {
  agent,
  canisterId,
})
