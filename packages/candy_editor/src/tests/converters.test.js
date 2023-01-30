import {
  isInRange,
  convertToNat,
  convertToNat8,
  convertToNat16,
  convertToNat32,
  convertToNat64,
} from '../assets/formTypes/NatForms/converters';

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

  it('convertToNat8 > returns a CandyNat8 object for valid natural number strings', () => {
    expect(convertToNat8('152')).toEqual({ Nat8: Number(152) });
    expect(convertToNat8('1')).toEqual({ Nat8: Number(1) });
    expect(convertToNat8('0')).toEqual({ Nat8: Number(0) });
  });

  it('convertToNat8 > returns undefined for non-natural number strings', () => {
    expect(convertToNat8('-645')).toBe(undefined);
    expect(convertToNat8('0.545')).toBe(undefined);
    expect(convertToNat8('helloWorld')).toBe(undefined);
    expect(convertToNat8('256')).toBe(undefined);
  });

  it('convertToNat16 > returns a CandyNat16 object for valid natural number strings', () => {
    expect(convertToNat16('152')).toEqual({ Nat16: Number(152) });
    expect(convertToNat16('1')).toEqual({ Nat16: Number(1) });
    expect(convertToNat16('51535')).toEqual({ Nat16: Number(51535) });
  });

  it('convertToNat16 > returns undefined for non-natural number strings', () => {
    expect(convertToNat16('-645')).toBe(undefined);
    expect(convertToNat16('0.545')).toBe(undefined);
    expect(convertToNat16('helloWorld')).toBe(undefined);
    expect(convertToNat16('65536')).toBe(undefined);
  });

  it('convertToNat32 > returns a CandyNat32 object for valid natural number strings', () => {
    expect(convertToNat32('152')).toEqual({ Nat32: Number(152) });
    expect(convertToNat32('1')).toEqual({ Nat32: Number(1) });
    expect(convertToNat32('4294967295')).toEqual({ Nat32: Number(4294967295) });
  });

  it('convertToNat32 > returns undefined for non-natural number strings', () => {
    expect(convertToNat32('-6')).toBe(undefined);
    expect(convertToNat32('0.55')).toBe(undefined);
    expect(convertToNat32('helloWorld')).toBe(undefined);
    expect(convertToNat32('4294967296')).toBe(undefined);
  });

  it('convertToNat64 > returns a CandyNat64 object for valid natural number strings', () => {
    expect(convertToNat64('0')).toEqual({ Nat64: 0n });
    expect(convertToNat64('100')).toEqual({ Nat64: 100n });
    expect(convertToNat64('18446744073709551615')).toEqual({ Nat64: 18446744073709551615n });
  });

  it('convertToNat64 > returns undefined for non-natural number strings', () => {
    expect(convertToNat64('-6')).toBe(undefined);
    expect(convertToNat64('0.55')).toBe(undefined);
    expect(convertToNat64('helloWorld')).toBe(undefined);
    expect(convertToNat64('18446744073709551616')).toBe(undefined);
  });
});
