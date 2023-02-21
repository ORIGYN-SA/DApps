import { PropertyWithType, Property } from '../types'

export function isInRange(
  num: number | bigint,
  min: number | bigint,
  max: number | bigint,
): boolean {
  return num >= min && num <= max;
}

export function getValueType(property: Property): PropertyWithType {
  let propertyWithType: PropertyWithType;
  const valueType: string = Object.getOwnPropertyNames(property.value)[0];
  return propertyWithType = {
    type: valueType,
    name: property.name,
    immutable: property.immutable,
    value: property.value
  };
}

export function limitByteArraySize(byteArray: Uint8Array, maxByteArraySize: number): Uint8Array | undefined {
  if (byteArray.length > maxByteArraySize) {
    return undefined;
  } else {
    return byteArray;
  }
}