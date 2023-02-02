import { PropertyType, Property } from '../types'

export function isInRange(
  num: number | bigint,
  min: number | bigint,
  max: number | bigint,
): boolean {
  return num >= min && num <= max;
}

export function getValueType(property: Property): PropertyType {
  let propertyType: PropertyType;
  const valueType: string = Object.getOwnPropertyNames(property.value)[0];
  return propertyType = {
    type: valueType,
    name: property.name,
    immutable: property.immutable,
    value: property.value
  };
}