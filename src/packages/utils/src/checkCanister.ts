// This function checks if the canister (passed as argument) is valid.
// If it is not, it returns an empty string.
// ----------------------------------------------------------------------------
// Arguments: canister (string)
// Returns: string
// Author: Alessandro
// Date: 2022-08-28
// ----------------------------------------------------------------------------

import { Principal } from '@dfinity/principal';
import { lookupCanisterId, PATTERNS } from '@origyn/perpetualos-context';
import { OrigynClient, getNftCollectionMeta } from '@origyn/mintjs';

/**
 * Validates a canister ID or collection ID
 * @param id A canister ID or collection ID (name for canister ID in phone book)
 * @returns A valid canister ID or an empty string
 */
export const validateCanisterOrCollectionId = async (
  id: string,
  isProd: boolean,
): Promise<string> => {
  let lowerId = id.trim().toLowerCase();
  let canisterId: string = '';

  // Check if the canister ID is in the correct format
  const isCanisterId = PATTERNS.CanisterId.test(lowerId);
  if (isCanisterId) {
    canisterId = lowerId;
    // Ensure the canister ID is valid
    try {
      Principal.fromText(canisterId);
    } catch (e) {
      return '';
    }
  } else {
    // could be a collection id (canister name)
    // lookup canister ID in phone book
    canisterId = await lookupCanisterId(id);
    if (!canisterId) {
      return '';
    }
  }

  // check if the canister is an Origyn NFT canister
  try {
    await OrigynClient.getInstance().init(isProd, canisterId);
    const hasNFT = await getNftCollectionMeta();
    if ('ok' in hasNFT) {
      return canisterId;
    } else {
      return '';
    }
  } catch (e) {
    return '';
  }
};
