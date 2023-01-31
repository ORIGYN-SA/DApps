import { CandyInt, CandyInt8, CandyInt16, CandyInt32, CandyInt64 } from '../../../types';

export function isInRange(
  num: number | bigint,
  min: number | bigint,
  max: number | bigint,
): boolean {
  return num >= min && num <= max;
}

export function convertToCandyInt(typedValue: string): CandyInt | undefined {
  if (/^-?\d+$/.test(typedValue)) {
    const num = Number(typedValue);
    const bigInt = BigInt(num);
    return { Int: bigInt };
  }
  return undefined;
}

export function convertToCandyInt8(typedValue: string): CandyInt8 | undefined {
  if (/^-?\d+$/.test(typedValue) && isInRange(Number(typedValue), -128, 127)) {
    const num = Number(typedValue);
    return { Int8: num };
  }
  return undefined;
}

export function convertToCandyInt16(typedValue: string): CandyInt16 | undefined {
  if (/^-?\d+$/.test(typedValue) && isInRange(Number(typedValue), -32768, 32767)) {
    const num = Number(typedValue);
    return { Int16: num };
  }
  return undefined;
}

export function convertToCandyInt32(typedValue: string): CandyInt32 | undefined {
  if (/^-?\d+$/.test(typedValue) && isInRange(Number(typedValue), -2147483648, 2147483647)) {
    const num = Number(typedValue);
    return { Int32: num };
  }
  return undefined;
}

export function convertToCandyInt64(typedValue: string): CandyInt64 | undefined {
  if (
    /^-?\d+$/.test(typedValue) &&
    isInRange(BigInt(typedValue), BigInt(-9223372036854775808n), BigInt(9223372036854775807n))
  ) {
    const bigInt = BigInt(typedValue);
    return { Int64: bigInt };
  }
  return undefined;
}
