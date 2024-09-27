// src/utils/principalUtils.ts

import { Principal } from '@dfinity/principal';

/**
 * Converts a byte array to a readable Principal string.
 * @param {number[]} arr - The byte array representing the Principal.
 * @returns {string} - The readable Principal string.
 */
export const convertPrincipalArrayToString = (arr: number[]): string => {
  try {
    const uint8Array = new Uint8Array(arr);
    return Principal.fromUint8Array(uint8Array).toText();
  } catch (error) {
    console.error('Error converting Principal:', error);
    return 'Invalid Principal';
  }
};
