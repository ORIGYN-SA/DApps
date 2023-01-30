import { CandyNat, CandyNat8, CandyNat16, CandyNat32, CandyNat64 } from '../../../types';

export function isInRange(num: number | bigint, min: number, max: number | bigint): boolean {
  return num >= min && num <= max;
}

export function convertToNat(typedValue: string): CandyNat | undefined {
  if (/^\d+$/.test(typedValue)) {
    const num = Number(typedValue);
    const bigInt = BigInt(num);
    return { Nat: bigInt };
  }
  return undefined;
}

export function convertToNat8(typedValue: string): CandyNat8 | undefined {
  if (/^\d+$/.test(typedValue) && isInRange(Number(typedValue), 0, 255)) {
    const num = Number(typedValue);
    return { Nat8: num };
  }
  return undefined;
}

export function convertToNat16(typedValue: string): CandyNat16 | undefined {
  if (/^\d+$/.test(typedValue) && isInRange(Number(typedValue), 0, 65535)) {
    const num = Number(typedValue);
    return { Nat16: num };
  }
  return undefined;
}

export function convertToNat32(typedValue: string): CandyNat32 | undefined {
  if (/^\d+$/.test(typedValue) && isInRange(Number(typedValue), 0, 4294967295)) {
    const num = Number(typedValue);
    return { Nat32: num };
  }
  return undefined;
}

export function convertToNat64(typedValue: string): CandyNat64 | undefined {
  if (/^\d+$/.test(typedValue) && isInRange(BigInt(typedValue), 0, BigInt(18446744073709551615n))) {
    const bigInt = BigInt(typedValue);
    return { Nat64: bigInt };
  }
  return undefined;
}
