// This function checks if the canister (passed as argument) is valid.
// If it is not, it returns false.
// Arguments: canister (string)
// Returns: boolean || string
// Author: Alessandro
// Date: 2022-08-28

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
      const actor = Actor.createActor(phonebookIdl, {
        agent: agent,
        canisterId: 'ngrpb-5qaaa-aaaaj-adz7a-cai',
      });
      // First check:
      // Check if the Canister is registered in the phone_book.
      // @ts-ignore
      canisterId = (await actor.lookup(newCanister)).toString();

      if (canisterId) {
        // Second check:
        // Check if the registered Canister is an NFT canister
        const newActor = Actor.createActor(origynNftIdl, {
          agent: agent,
          canisterId: canisterId,
        });

        try {
          const hasNFT = await newActor.collection_nft_origyn([]);
          if (hasNFT) {
            return canisterId;
          }
        } catch (e) {
          console.log('Canister in the phone_book - Not an NFT canister');
          canisterId = false;
          return canisterId;
        }
      } else {
        // Third check:
        // If the Canister is not registered in the phone_book, check if it is an NFT canister.
        const newActor = Actor.createActor(origynNftIdl, {
          agent: agent,
          canisterId: newCanister,
        });
        try {
          const hasNFT = await newActor.collection_nft_origyn([]);
          if (hasNFT) {
            canisterId = newCanister;
            return canisterId;
          }
        } catch (e) {
          console.log('Not in the phone_book - Not an NFT canister');
          canisterId = false;
          return canisterId;
        }

      }
    }
  }
};
