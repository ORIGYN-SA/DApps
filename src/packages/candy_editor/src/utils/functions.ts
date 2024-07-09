import { PropertyWithType, CandyProperty } from '@dapp/common-types';
export function isInRange(
  num: number | bigint,
  min: number | bigint,
  max: number | bigint,
): boolean {
  return num >= min && num <= max;
}

export function getValueType(property: CandyProperty): PropertyWithType {
  let propertyWithType: PropertyWithType;
  const valueType: string = Object.getOwnPropertyNames(property.value)[0];
  return (propertyWithType = {
    type: valueType,
    name: property.name,
    immutable: property.immutable,
    value: property.value,
  });
}
