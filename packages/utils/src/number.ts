import BigNumber from 'bignumber.js';

export const padNum = (num: number | string, size: number = 2) => {
  let res = num.toString();
  while (res.length < size) res = '0' + res;
  return res;
};

// TODO: We can't assume 8 decimals. It's based on the token defininition.
export const natToFloat = (n: string) => {
  return parseFloat((parseInt(n) * 1e-8).toString()).toFixed(8);
};

export const isPositiveFloat = (s: string): boolean => {
  // allows number to end with decimal point for validating form input
  return /^(?:[1-9][0-9]*|0)?(?:\.[0-9]*)?$/.test(s);
};

export const toLargerUnit = (num: number, decimals: number): number => {
  // Fixes floating point arithmetic
  // Converts a number like 12300000 to 0.123 (if decimals = 8)
  if (decimals < 0) {
    throw new Error('decimals can not be negative');
  }

  if (decimals === 0) {
    return num;
  }

  const result = new BigNumber(num.toString())
    .dividedBy(new BigNumber('10').pow(decimals))
    .decimalPlaces(decimals);

  return parseFloat(result.toString());
};

export const toSmallerUnit = (num: number, decimals: number): number => {
  // Fixes floating point arithmetic
  // Converts a number like 0.123 to 12300000 (if decimals = 8)
  if (decimals < 0) {
    throw new Error('decimals can not be negative');
  }

  if (decimals === 0) {
    return num;
  }

  const result = new BigNumber(num.toString())
    .times(new BigNumber('10').pow(decimals))
    .decimalPlaces(decimals);

  return parseFloat(result.toString());
};

export const addCurrencies = (amount1: number, amount2: number, decimals: number): number => {
  // Fixes floating point arithmetic
  const bnAmount1 = new BigNumber(amount1.toString());
  const bnAmount2 = new BigNumber(amount2.toString());
  const result = bnAmount1.plus(bnAmount2).decimalPlaces(decimals);
  return parseFloat(result.toString());
};

export const subtractCurrencies = (amount1: number, amount2: number, decimals: number): number => {
  // Fixes floating point arithmetic
  const bnAmount1 = new BigNumber(amount1.toString());
  const bnAmount2 = new BigNumber(amount2.toString());
  const result = bnAmount1.minus(bnAmount2).decimalPlaces(decimals);
  return parseFloat(result.toString());
};
