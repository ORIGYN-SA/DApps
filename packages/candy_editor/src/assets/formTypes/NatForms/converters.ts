import {
  CandyNat,
  CandyNat8,
  CandyNat16,
  CandyNat32,
  CandyNat64,
  CandyNaturals,
  CandyType,
} from '../../../types';
import { isInRange } from '../../../utils/functions';

export function convertToCandyNat(typedValue: string): CandyNat | undefined {
  if (/^\d+$/.test(typedValue)) {
    const num = Number(typedValue);
    const bigInt = BigInt(num);
    return { Nat: bigInt };
  }
  return undefined;
}

export function convertToCandyNat8(typedValue: string): CandyNat8 | undefined {
  if (/^\d+$/.test(typedValue) && isInRange(Number(typedValue), 0, 255)) {
    const num = Number(typedValue);
    return { Nat8: num };
  }
  return undefined;
}

export function convertToCandyNat16(typedValue: string): CandyNat16 | undefined {
  if (/^\d+$/.test(typedValue) && isInRange(Number(typedValue), 0, 65535)) {
    const num = Number(typedValue);
    return { Nat16: num };
  }
  return undefined;
}

export function convertToCandyNat32(typedValue: string): CandyNat32 | undefined {
  if (/^\d+$/.test(typedValue) && isInRange(Number(typedValue), 0, 4294967295)) {
    const num = Number(typedValue);
    return { Nat32: num };
  }
  return undefined;
}

export function convertToCandyNat64(typedValue: string): CandyNat64 | undefined {
  if (/^\d+$/.test(typedValue) && isInRange(BigInt(typedValue), 0, BigInt(18446744073709551615n))) {
    const bigInt = BigInt(typedValue);
    return { Nat64: bigInt };
  }
  return undefined;
}

export function convertNaturalNumberToString(
  naturalNumber: CandyNaturals,
  typeOfNatural: CandyType,
): string {
  switch (typeOfNatural) {
    case 'Nat':
      return (naturalNumber as CandyNat).Nat.valueOf().toString();
    case 'Nat8':
      return (naturalNumber as CandyNat8).Nat8.valueOf().toString();
    case 'Nat16':
      return (naturalNumber as CandyNat16).Nat16.valueOf().toString();
    case 'Nat32':
      return (naturalNumber as CandyNat32).Nat32.valueOf().toString();
    case 'Nat64':
      return (naturalNumber as CandyNat64).Nat64.valueOf().toString();
  }
}
