// This function checks if the canister (passed as argument) is valid.
// If it is not, it returns false.
// ----------------------------------------------------------------------------
// Arguments: canister (string)
// Returns: boolean || string
// Author: Alessandro
// Date: 2022-08-28
// ----------------------------------------------------------------------------

import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent } from '@dfinity/agent';
import { phonebookIdl, origynNftIdl } from '@dapp/common-candid';

export const checkCanister = async (newCanister) => {
  let canisterId: string | boolean;
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
      const phonebook_actor = Actor.createActor(phonebookIdl, {
        agent: agent,
        canisterId: 'ngrpb-5qaaa-aaaaj-adz7a-cai',
      });
      // First check:
      // Check if the Canister is registered in the phone_book.
      // @ts-ignore
      canisterId = (await phonebook_actor.lookup(newCanister)).toString();
      if (canisterId) {
        // Second check:
        // Check if the registered Canister is an NFT canister
        const nft_actor = Actor.createActor(origynNftIdl, {
          agent: agent,
          canisterId: canisterId,
        });

        try {
          const hasNFT = await nft_actor.collection_nft_origyn([]);
          if (hasNFT) {
            return canisterId;
          }
        } catch (e) {
          console.log('Canister in the phone_book - Not an NFT canister');
          canisterId = false;
          return canisterId;
        }
      } else {
        // Third-Fourth check:
        // Check if the unregistered Canister has a valid format and is an NFT canister
        try {
          Principal.fromText(newCanister);
          canisterId = newCanister;
          const nft_actor = Actor.createActor(origynNftIdl, {
            agent: agent,
            canisterId: newCanister,
          });
          const hasNFT = await nft_actor.collection_nft_origyn([]);
          if (hasNFT) {
            canisterId = newCanister;
            return canisterId;
          } else {
            // If the canister is not an NFT canister, return false
            console.log('Not in the phone_book - Not an NFT canister');
            canisterId = false;
            return canisterId;
          }
        } catch (e) {
          // If the canister is not in the phone_book and not in the correct format, return false
          console.log('Not a valid canister');
          canisterId = false;
          return canisterId;
        }
      }
    }
  }
};
