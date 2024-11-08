import { Principal } from '@dfinity/principal'

export const convertPrincipalArrayToString = (arr: Uint8Array): string => {
  try {
    return Principal.fromUint8Array(arr).toText()
  } catch (error) {
    console.error('Error converting Principal:', error)
    return 'Invalid Principal'
  }
}
