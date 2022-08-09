export const formatNumber = (val: number) => {
  let parts = val.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

export const padNum = (num: number | string, size: number = 2) => {
  let res = num.toString();
  while (res.length < size) res = "0" + res;
  return res;
};
export const natToFloat = (n: string) => {
  return parseFloat((parseInt(n) * 1e-9).toString()).toFixed(9);
};
