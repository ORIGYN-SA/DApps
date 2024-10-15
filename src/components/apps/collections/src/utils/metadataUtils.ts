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
    if ('Text' in metadata) {
      tokenName = metadata.Text
    }
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
export const extractOwner = (metadata: Metadata): string => {
  if (hasClass(metadata)) {
    const ownerField = metadata.Class.find(
      field => field.name === 'owner' && field.value?.Principal,
    )
    if (ownerField && ownerField.value.Principal?._arr) {
      const ownerArr = ownerField.value.Principal._arr
      return convertPrincipalArrayToString(Object.values(ownerArr))
    }
  } else if (hasMap(metadata)) {
    return 'Unknown'
  }
  return 'Unknown'
}
