// src/utils/typeGuards.ts

import { MetadataWithClass, CandyShared } from '../types/global'

/**
 * Checks if the metadata contains the 'Class' property.
 * @param metadata - The metadata object to check.
 * @returns {metadata is MetadataWithClass} - True if metadata has 'Class', otherwise false.
 */
export const hasClass = (metadata: any): metadata is MetadataWithClass => {
  return (
    metadata && typeof metadata === 'object' && 'Class' in metadata && Array.isArray(metadata.Class)
  )
}

/**
 * Checks if the metadata contains the 'Map' property.
 * @param metadata - The metadata object to check.
 * @returns {metadata is CandyShared} - True if metadata has 'Map', otherwise false.
 */
export const hasMap = (metadata: any): metadata is CandyShared => {
  return (
    metadata && typeof metadata === 'object' && 'Map' in metadata && Array.isArray(metadata.Map)
  )
}
