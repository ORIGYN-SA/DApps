import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent } from '@dfinity/agent';
import { phonebookIdl } from '@dapp/common-candid';

const PHONE_BOOK_CANISTER = 'ngrpb-5qaaa-aaaaj-adz7a-cai';

// TODO: Unit test with all URL variations including localhost
export const useRoute = async () => {
  const ids = window.location.pathname.split('/');
  let canisterId = '';
  let tokenId = null;

  if (ids.includes('collection')) {
    tokenId = '';
  }
  try {
    const subdomain = window.location.hostname.split('.')[0];
    // If it parses to a principal, it's a canister id
    Principal.fromText(subdomain);
    if (tokenId === null) tokenId = ids[2];
    return { canisterId: subdomain, tokenId };
  } catch (e) {
    if (tokenId === null) tokenId = ids[4];
    try {
      // If it parses to a principal, it's a canister id
      Principal.fromText(ids[2]);
      canisterId = ids[2];
    } catch (e) {
      // If it's not a principal, check if its a named canister.
      // Lookup the canister name in the phone book to get the canister id
      const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/',
      });
      const actor = Actor.createActor(phonebookIdl, {
        agent: agent,
        canisterId: PHONE_BOOK_CANISTER,
      });
      // @ts-ignore
      canisterId = (await actor.lookup(ids[2])).toString();
    }
  }
  return { canisterId, tokenId };
};
