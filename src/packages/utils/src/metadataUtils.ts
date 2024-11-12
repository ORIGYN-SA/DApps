import { Principal } from '@dfinity/principal'

import {
  CandyShared,
  _SERVICE as NFT_SERVICE,
} from '../../../packages/common/canisters/gld_nft/interfaces/gld_nft'

export const generateImageUrl = (canisterId: string, assetName: string): string => {
  return `https://prptl.io/-/${canisterId}/-/${assetName}/preview`
}

export const extractMetadata = (
  metadata: CandyShared,
  canisterId: string,
): { tokenName: string; imageUrl: string } => {
  let tokenName = 'Unknown'
  let imageUrl = ''
  if ('Class' in metadata) {
    const classProperties = metadata.Class
    const nameField = classProperties.find(
      (field: any) => field.name === 'id' && 'Text' in field.value,
    )
    if (nameField && 'Text' in nameField.value) {
      tokenName = nameField.value.Text
    }

    const imageField = classProperties.find(
      (field: any) => field.name === 'primary_asset' && 'Text' in field.value,
    )
    if (imageField && 'Text' in imageField.value) {
      imageUrl = generateImageUrl(canisterId, tokenName)
    }
  } else {
    console.warn('The metadata does not contain a Class type.')
  }

  return { tokenName, imageUrl }
}

/**
 * Extracts the token name from metadata.
 */

/**
 * Extracts the owner from metadata.
 */
export function extractOwner (nftResultItem: any): string | null {
  try {
    const metadata = nftResultItem?.ok?.metadata?.Class
    if (metadata && Array.isArray(metadata)) {
      const ownerField = metadata.find((item: any) => item.name === 'owner')

      if (ownerField && ownerField.value?.Array?.[0]?.Principal?._arr) {
        const ownerPrincipal = ownerField.value.Array[0].Principal

        if (ownerPrincipal._isPrincipal) {
          return Principal.fromUint8Array(ownerPrincipal._arr).toText()
        }
      }
    }
  } catch (error) {
    console.error('Error extracting owner:', error)
  }

  return null
}

export const convertTokenId = async (
  nftId: string | bigint,
  actor: NFT_SERVICE,
): Promise<bigint | string> => {
  if (typeof nftId === 'string') {
    try {
      const natValue = await actor.get_token_id_as_nat(nftId)
      return natValue
    } catch (error) {
      console.error(`Error converting string to nat for token ID: ${nftId}`, error)
      throw new Error('Unable to convert token ID to nat')
    }
  } else if (typeof nftId === 'bigint') {
    try {
      const textValue = await actor.get_nat_as_token_id_origyn(nftId)
      return textValue
    } catch (error) {
      console.error(`Error converting nat to string for token ID: ${nftId}`, error)
      throw new Error('Unable to convert token ID to text')
    }
  } else {
    throw new Error('Invalid token ID type')
  }
}
