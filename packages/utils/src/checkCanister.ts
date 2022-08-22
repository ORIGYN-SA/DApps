import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent} from '@dfinity/agent';
import { phonebookIdl } from '@dapp/common-candid';

export const checkCanister = async (newCanister) => {

  let canisterId : string|boolean;

  try {
    const subdomain = window.location.hostname.split('.')[0];
    Principal.fromText(subdomain);
    return subdomain;
  } catch (e) {
    try {
      Principal.fromText(newCanister);
      canisterId = newCanister;
      return canisterId;
    } catch (e) {
      const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/',
      });
      const actor = Actor.createActor(phonebookIdl, {
        agent: agent,
        canisterId: 'ngrpb-5qaaa-aaaaj-adz7a-cai',
      });
      // @ts-ignore
      canisterId = (await actor.lookup(newCanister)).toString();
    }
  }
  return (!canisterId) ? (canisterId=false) : canisterId;
  
};
