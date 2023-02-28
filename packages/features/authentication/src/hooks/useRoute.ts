import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent } from '@dfinity/agent';
import { phonebookIdl } from '@dapp/common-candid';

export const useRoute = async () => {
  const ids = window.location.pathname.split('/');
  let canisterId = '';
  let tokenId = null;

  if (ids.includes('collection')) {
    tokenId = '';
  }
  try {
    const subdomain = window.location.hostname.split('.')[0];
    Principal.fromText(subdomain);
    if (tokenId === null) tokenId = ids[2];
    return { canisterId: subdomain, tokenId };
  } catch (e) {
    if (tokenId === null) tokenId = ids[4];
    try {
      Principal.fromText(ids[2]);
      canisterId = ids[2];
    } catch (e) {
      const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/',
      });
      const actor = Actor.createActor(phonebookIdl, {
        agent: agent,
        canisterId: 'ngrpb-5qaaa-aaaaj-adz7a-cai',
      });
      // @ts-ignore
      canisterId = (await actor.lookup(ids[2])).toString();
    }
  }
  return { canisterId, tokenId };
};