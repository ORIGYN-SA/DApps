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

export const isPositiveNumber = (s: string): boolean => {
  // allows number to end with decimal point for validating form input
  return /^(?:[1-9][0-9]*|0)?(?:\.[0-9]*)?$/.test(s);
};

export const toBigNumber = (
  num: number | string | BigInt | BigNumber,
  fallbackValue?: number | BigNumber,
): BigNumber => {
  if (num instanceof BigNumber) {
    return num;
  }

  let result = new BigNumber(num?.toString());
  if (result.isNaN()) {
    if (fallbackValue) {
      return new BigNumber(fallbackValue);
    } else {
      return new BigNumber(0);
    }
  }

  return result;
};

export const toLargerUnit = (
  amount: number | string | BigInt | BigNumber,
  decimals: number | BigInt,
): BigNumber => {
  // Fixes floating point arithmetic
  // Converts a number like 12300000 to 0.123 (if decimals = 8)
  if (decimals <= 0) {
    throw new Error('decimals must be greater than 0');
  } else if (typeof amount === 'string' && !isPositiveNumber(amount)) {
    throw new Error('amount must be a valid number');
  }
  const dec = Number(decimals);
  return toBigNumber(amount).dividedBy(new BigNumber('10').pow(dec)).decimalPlaces(dec);
};

export const toSmallerUnit = (
  amount: number | string | BigInt | BigNumber,
  decimals: number | BigInt,
): BigNumber => {
  // Fixes floating point arithmetic
  // Converts a number like 0.123 to 12300000 (if decimals = 8)
  if (decimals <= 0) {
    throw new Error('decimals must be greater than 0');
  } else if (typeof amount === 'string' && !isPositiveNumber(amount)) {
    throw new Error('amount must be a valid number');
  }

  const dec = Number(decimals);
  return toBigNumber(amount).times(new BigNumber('10').pow(dec)).decimalPlaces(dec);
};

export const validateTokenAmount = (
  amount: string,
  decimals: number | BigInt,
): string | undefined => {
  // ensure amount does not exceed 16 digits, or it can't convert to a number

  if (!isPositiveNumber(amount)) {
    return 'Amount is invalid';
  }

  const dec = Number(decimals);
  const leftDigits = 16 - dec;
  const [wholePart, decimalPart] = amount.split('.');
  if (wholePart.length > leftDigits) {
    //return `${wholePart.slice(0, leftDigits)}.${decimalPart?.slice(0, decimals) ?? ''}`;
    return `Amount exceeds limit of ${'9'.repeat(leftDigits)}.${'9'.repeat(dec)}`;
  } else if (decimalPart?.length > dec) {
    return `Decimal places exceed limit of ${dec}`;
  }

  //return decimalPart !== undefined ? `${wholePart}.${decimalPart.slice(0, decimals)}` : wholePart;
  return undefined;
};
