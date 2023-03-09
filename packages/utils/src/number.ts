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
  if (decimals <= 0) {
    return num;
  }
  return Number((num / 10 ** decimals).toFixed(decimals));
};

export const toSmallerUnit = (num: number, decimals: number): number => {
  if (decimals <= 0) {
    return num;
  }
  return num * 10 ** decimals;
};
