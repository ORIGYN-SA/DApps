import { Principal } from '@dfinity/principal';
import { PropertyShared } from '@origyn/mintjs';
import {
  getProperty,
  getTextValue,
  isCandyClassOrArray,
  candyValueToString,
} from '../metadataParser';

describe('getProperty function', () => {
  const properties = [
    { name: 'property1', value: { Text: 'hello' }, immutable: false },
    { name: 'property2', value: { Text: 'world' }, immutable: true },
    { name: 'property3', value: { Class: {} }, immutable: false },
  ];

  it('returns undefined when the properties object is undefined', () => {
    const result = getProperty(undefined, 'property1');
    expect(result).toBeUndefined();
  });

  it('returns undefined when the property is not found', () => {
    const result = getProperty(properties, 'does_not_exist');
    expect(result).toBeUndefined();
  });

  it('returns the property when it is found', () => {
    const result = getProperty(properties, 'property1');
    expect(result).toEqual(properties[0]);
  });
});

describe('getTextValue function', () => {
  const properties: PropertyShared[] = [
    { name: 'property1', value: { Text: 'hello' }, immutable: false },
    { name: 'property2', value: { Text: 'world' }, immutable: true },
  ];

  it('returns an empty string when the property value is undefined', () => {
    const result = getTextValue(properties, 'undefinedProperty');
    expect(result).toEqual('');
  });

  it('returns an empty string when the property value is not a Text value', () => {
    const result = getTextValue(properties, 'property3');
    expect(result).toEqual('');
  });

  it('returns the Text value of the property', () => {
    const result = getTextValue(properties, 'property1');
    expect(result).toEqual('hello');
  });
});

describe('isCandyClassOrArray function', () => {
  it('returns true when the candy is a class', () => {
    const candy: PropertyShared = { name: 'property', value: { Class: [] }, immutable: false };
    const result = isCandyClassOrArray(candy);
    expect(result).toEqual(true);
  });

  it('returns true when the candy is an array', () => {
    const candy: PropertyShared = {
      name: 'property',
      value: { Array: [] },
      immutable: false,
    };
    const result = isCandyClassOrArray(candy);
    expect(result).toEqual(true);
  });

  it('returns false when the candy is not a class or array', () => {
    const candy: PropertyShared = { name: 'property', value: { Text: 'hello' }, immutable: false };
    const result = isCandyClassOrArray(candy);
    expect(result).toEqual(false);
  });
});

describe('candyValueToString function', () => {
  it('returns an empty string when the candy value is undefined', () => {
    // @ts-ignore
    const candy: PropertyShared = { name: 'property', value: undefined, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('');
  });

  it('returns the Text value as a string', () => {
    const candy: PropertyShared = { name: 'property', value: { Text: 'hello' }, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('hello');
  });

  it('returns the Nat value as a string', () => {
    const candy: PropertyShared = { name: 'property', value: { Nat: BigInt(42) }, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('42');
  });

  it('returns the Nat8 value as a string', () => {
    const candy: PropertyShared = { name: 'property', value: { Nat8: 42 }, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('42');
  });

  it('returns the Nat16 value as a string', () => {
    const candy: PropertyShared = { name: 'property', value: { Nat16: 42 }, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('42');
  });

  it('returns the Nat32 value as a string', () => {
    const candy: PropertyShared = { name: 'property', value: { Nat32: 42 }, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('42');
  });

  it('returns the Nat64 value as a string', () => {
    const candy: PropertyShared = { name: 'property', value: { Nat64: BigInt(42) }, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('42');
  });

  it('returns the Int value as a string', () => {
    const candy: PropertyShared = { name: 'property', value: { Int: BigInt(-42) }, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('-42');
  });

  it('returns the Int8 value as a string', () => {
    const candy: PropertyShared = { name: 'property', value: { Int8: -42 }, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('-42');
  });

  it('returns the Int16 value as a string', () => {
    const candy: PropertyShared = { name: 'property', value: { Int16: -42 }, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('-42');
  });

  it('returns the Int32 value as a string', () => {
    const candy: PropertyShared = { name: 'property', value: { Int32: -42 }, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('-42');
  });

  it('returns the Int64 value as a string', () => {
    const candy: PropertyShared = { name: 'property', value: { Int64: BigInt(-42) }, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('-42');
  });

  it('returns the Float value as a string', () => {
    const candy: PropertyShared = { name: 'property', value: { Float: 3.14 }, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('3.14');
  });

  it('returns the Bool value as a string', () => {
    const candy: PropertyShared = { name: 'property', value: { Bool: true }, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('true');
  });

  it('returns the Principal value as a string', () => {
    const principalId = '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe';

    const candy: PropertyShared = {
      name: 'property',
      value: {
        Principal: Principal.fromText(principalId),
      },
      immutable: false,
    };
    const result = candyValueToString(candy);
    expect(result).toEqual(principalId);
  });

  it('returns an empty string for unsupported types', () => {
    // @ts-ignore
    const candy: PropertyShared = { name: 'property', value: null, immutable: false };
    const result = candyValueToString(candy);
    expect(result).toEqual('');
  });
});
