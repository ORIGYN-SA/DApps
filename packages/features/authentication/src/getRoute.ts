import { Principal } from '@dfinity/principal'
import { Actor, HttpAgent } from '@dfinity/agent'
import { phonebookIdl } from '@dapp/common-candid'

export const getCanisterId = async () => {
  const ids = window.location.pathname.split('/')
  let canisterId = ''

  try {
    const subdomain = window.location.hostname.split('.')[0]
    Principal.fromText(subdomain)
    return subdomain
  } catch (e) {
    try {
      Principal.fromText(ids[2])
      canisterId = ids[2]
      return canisterId
    } catch (e) {
      const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/',
      })
      const actor = Actor.createActor(phonebookIdl, {
        agent: agent,
        canisterId: 'ngrpb-5qaaa-aaaaj-adz7a-cai',
      })
      // @ts-ignore
      canisterId = (await actor.lookup(ids[2])).toString()
    }
  }
  return canisterId
}

export const getTokenId = () => {
  const ids = window.location.pathname.split('/')

  if (ids.includes('collection')) {
    return ''
  }

  try {
    const subdomain = window.location.hostname.split('.')[0]
    Principal.fromText(subdomain)
    return ids[2]
  } catch (e) {
    return ids[4]
  }
  return
}
