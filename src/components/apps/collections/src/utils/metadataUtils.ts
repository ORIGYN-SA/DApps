import { Principal } from '@dfinity/principal'
import { CandyShared } from '../canisters/gld_nft/interfaces/gld_nft'
import { Metadata } from '../types/global'
import { convertPrincipalArrayToString } from './principalUtils'
import { hasClass, hasMap } from './typeGuards'

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
export const extractTokenName = (metadata: Metadata): string => {
  if (hasClass(metadata)) {
    const nameField = metadata.Class.find(field => field.name === 'id' && field.value?.Text)
    return nameField?.value?.Text || 'Unknown'
  } else if (hasMap(metadata)) {
    return 'Unknown'
  }
  return 'Unknown'
}

/**
 * Extracts the owner from metadata.
 */
export const extractOwner = (metadata: any): string => {
  if (metadata && Array.isArray(metadata.Class)) {
    const ownerField = metadata.Class.find((field: any) => field.name === 'owner')

    if (ownerField && Array.isArray(ownerField.value) && ownerField.value.length > 0) {
      const principalObj = ownerField.value[0]

      if (
        principalObj &&
        principalObj.Principal &&
        principalObj.Principal._arr instanceof Uint8Array
      ) {
        const ownerArr = principalObj.Principal._arr
        const ownerString = convertPrincipalArrayToString(ownerArr)
        console.log('Converted Owner:', ownerString)
        return ownerString
      }
    }
  }

  console.error('Owner field is missing or not an array.')
  return 'Unknown'
}
