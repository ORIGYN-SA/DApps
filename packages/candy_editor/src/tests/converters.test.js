import {
  isInRange,
  convertToNat,
  convertToNat8,
  convertToNat16,
  convertToNat32,
  convertToNat64,
} from '../assets/formTypes/NatForms/converters';
import {
  convertToInt,
  convertToInt8,
  convertToInt16,
  convertToInt32,
  convertToInt64,
} from '../assets/formTypes/IntForms/converters';
import { convertToBool } from '../assets/formTypes/BoolForm/converters';

describe('NatForms > converters.ts', () => {
  it('isInRange > returns true for numbers within the range', () => {
    expect(isInRange(10, 0, 30)).toBe(true);
    expect(isInRange(5, 5, 5)).toBe(true);
  });

  it('isInRange > returns false for numbers outside the range', () => {
    expect(isInRange(0, 4, 9)).toBe(false);
    expect(isInRange(3, 9, 10)).toBe(false);
  });

  it('convertToNat > returns a CandyNat object for valid natural number strings', () => {
    expect(convertToNat('152661')).toEqual({ Nat: BigInt(152661) });
    expect(convertToNat('1')).toEqual({ Nat: BigInt(1) });
    expect(convertToNat('0')).toEqual({ Nat: BigInt(0) });
  });

  it('convertToNat > returns undefined for non-natural number strings', () => {
    expect(convertToNat('-645')).toBe(undefined);
    expect(convertToNat('0.545')).toBe(undefined);
    expect(convertToNat('helloWorld')).toBe(undefined);
  });

  it('convertToNat8 > returns a CandyNat8 object for valid Nat8 number strings', () => {
    expect(convertToNat8('152')).toEqual({ Nat8: Number(152) });
    expect(convertToNat8('1')).toEqual({ Nat8: Number(1) });
    expect(convertToNat8('0')).toEqual({ Nat8: Number(0) });
  });

  it('convertToNat8 > returns undefined for non-Nat8 number strings', () => {
    expect(convertToNat8('-645')).toBe(undefined);
    expect(convertToNat8('0.545')).toBe(undefined);
    expect(convertToNat8('helloWorld')).toBe(undefined);
    expect(convertToNat8('256')).toBe(undefined);
  });

  it('convertToNat16 > returns a CandyNat16 object for valid Nat16 number strings', () => {
    expect(convertToNat16('152')).toEqual({ Nat16: Number(152) });
    expect(convertToNat16('1')).toEqual({ Nat16: Number(1) });
    expect(convertToNat16('51535')).toEqual({ Nat16: Number(51535) });
  });

  it('convertToNat16 > returns undefined for non-Nat16 number strings', () => {
    expect(convertToNat16('-645')).toBe(undefined);
    expect(convertToNat16('0.545')).toBe(undefined);
    expect(convertToNat16('helloWorld')).toBe(undefined);
    expect(convertToNat16('65536')).toBe(undefined);
  });

  it('convertToNat32 > returns a CandyNat32 object for valid Nat32 number strings', () => {
    expect(convertToNat32('152')).toEqual({ Nat32: Number(152) });
    expect(convertToNat32('1')).toEqual({ Nat32: Number(1) });
    expect(convertToNat32('4294967295')).toEqual({ Nat32: Number(4294967295) });
  });

  it('convertToNat32 > returns undefined for non-Nat32 number strings', () => {
    expect(convertToNat32('-6')).toBe(undefined);
    expect(convertToNat32('0.55')).toBe(undefined);
    expect(convertToNat32('helloWorld')).toBe(undefined);
    expect(convertToNat32('4294967296')).toBe(undefined);
  });

  it('convertToNat64 > returns a CandyNat64 object for valid Nat64 number strings', () => {
    expect(convertToNat64('0')).toEqual({ Nat64: 0n });
    expect(convertToNat64('100')).toEqual({ Nat64: 100n });
    expect(convertToNat64('18446744073709551615')).toEqual({ Nat64: 18446744073709551615n });
  });

  it('convertToNat64 > returns undefined for non-Nat64 number strings', () => {
    expect(convertToNat64('-6')).toBe(undefined);
    expect(convertToNat64('0.55')).toBe(undefined);
    expect(convertToNat64('helloWorld')).toBe(undefined);
    expect(convertToNat64('18446744073709551616')).toBe(undefined);
  });
});

describe('IntForms > converters.ts', () => {
  it('convertToInt > returns a CandyInt object for valid integer number strings', () => {
    expect(convertToInt('152661')).toEqual({ Int: BigInt(152661) });
    expect(convertToInt('1')).toEqual({ Int: BigInt(1) });
    expect(convertToInt('0')).toEqual({ Int: BigInt(0) });
    expect(convertToInt('-152661')).toEqual({ Int: BigInt(-152661) });
    expect(convertToInt('-1')).toEqual({ Int: BigInt(-1) });
    expect(convertToInt('-0')).toEqual({ Int: BigInt(0) });
  });

  it('convertToInt > returns undefined for non-integer number strings', () => {
    expect(convertToInt('0.545')).toBe(undefined);
    expect(convertToInt('helloWorld')).toBe(undefined);
  });

  it('convertToInt8 > returns a CandyInt8 object for valid Int8 number strings', () => {
    expect(convertToInt8('127')).toEqual({ Int8: Number(127) });
    expect(convertToInt8('1')).toEqual({ Int8: Number(1) });
    expect(convertToInt8('0')).toEqual({ Int8: Number(0) });
    expect(convertToInt8('-128')).toEqual({ Int8: Number(-128) });
    expect(convertToInt8('-1')).toEqual({ Int8: Number(-1) });
    expect(convertToInt8('0')).toEqual({ Int8: Number(0) });
  });

  it('convertToInt8 > returns undefined for non-Int8 number strings', () => {
    expect(convertToInt8('0.545')).toBe(undefined);
    expect(convertToInt8('helloWorld')).toBe(undefined);
    expect(convertToInt8('256')).toBe(undefined);
    expect(convertToInt8('-129')).toBe(undefined);
  });

  it('convertToInt16 > returns a CandyInt16 object for valid Int16 number strings', () => {
    expect(convertToInt16('152')).toEqual({ Int16: Number(152) });
    expect(convertToInt16('1')).toEqual({ Int16: Number(1) });
    expect(convertToInt16('32767')).toEqual({ Int16: Number(32767) });
    expect(convertToInt16('-152')).toEqual({ Int16: Number(-152) });
    expect(convertToInt16('-1')).toEqual({ Int16: Number(-1) });
    expect(convertToInt16('-32768')).toEqual({ Int16: Number(-32768) });
  });

  it('convertToInt16 > returns undefined for non-Int16 number strings', () => {
    expect(convertToInt16('0.545')).toBe(undefined);
    expect(convertToInt16('helloWorld')).toBe(undefined);
    expect(convertToInt16('32770')).toBe(undefined);
    expect(convertToInt16('-32769')).toBe(undefined);
  });

  it('convertToInt32 > returns a CandyInt32 object for valid Int32 number strings', () => {
    expect(convertToInt32('152')).toEqual({ Int32: Number(152) });
    expect(convertToInt32('1')).toEqual({ Int32: Number(1) });
    expect(convertToInt32('2147483647')).toEqual({ Int32: Number(2147483647) });
    expect(convertToInt32('-152')).toEqual({ Int32: Number(-152) });
    expect(convertToInt32('-1')).toEqual({ Int32: Number(-1) });
    expect(convertToInt32('-2147483648')).toEqual({ Int32: Number(-2147483648) });
  });

  it('convertToInt32 > returns undefined for non-Int32 number strings', () => {
    expect(convertToInt32('0.545')).toBe(undefined);
    expect(convertToInt32('helloWorld')).toBe(undefined);
    expect(convertToInt32('2147483649')).toBe(undefined);
    expect(convertToInt32('-2147483649')).toBe(undefined);
  });

  it('convertToInt64 > returns a CandyInt64 object for valid Int64 number strings', () => {
    expect(convertToInt64('152')).toEqual({ Int64: 152n });
    expect(convertToInt64('1')).toEqual({ Int64: 1n });
    expect(convertToInt64('9223372036854775807')).toEqual({ Int64: 9223372036854775807n });
    expect(convertToInt64('-152')).toEqual({ Int64: -152n });
    expect(convertToInt64('-1')).toEqual({ Int64: -1n });
    expect(convertToInt64('-9223372036854775808')).toEqual({ Int64: -9223372036854775808n });
  });

  it('convertToInt64 > returns undefined for non-Int64 number strings', () => {
    expect(convertToInt64('0.545')).toBe(undefined);
    expect(convertToInt64('helloWorld')).toBe(undefined);
    expect(convertToInt64('9223372036854775808')).toBe(undefined);
    expect(convertToInt64('-9223372036854775809')).toBe(undefined);
  });
});
describe('BoolForm > converters.ts', () => {
  it('convertToBool > returns a CandyBool object for valid boolean strings', () => {
    expect(convertToBool('true')).toEqual({ Bool: true });
    expect(convertToBool('false')).toEqual({ Bool: false });
  });

  it('convertToBool > returns undefined for non-boolean strings', () => {
    expect(convertToBool('true.')).toBe(undefined);
    expect(convertToBool('invalidString')).toBe(undefined);
  });
});
