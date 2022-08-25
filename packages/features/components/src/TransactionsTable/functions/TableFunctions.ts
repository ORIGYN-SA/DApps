import { Principal } from '@dfinity/principal';

// array without duplicates
export const removeDuplicates = (arr: string[]) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
// type Account
export const TypeAccount = (
  acc_principal: { _arr },
  acc_id: string,
  acc_extensible: string,
) => {
  const thisArray = Uint8Array.from(Object.values(acc_principal._arr));
  const acc_principal_string = Principal.fromUint8Array(thisArray).toText();
  return { acc_principal_string, acc_id, acc_extensible };
}
// type Token
export const TypeTokenSpec = (
  canister: { _arr: [] },
  fee: string,
  symbol: string,
  decimal: string,
  standard: string,
) => {
  const thisArray = Uint8Array.from(Object.values(canister._arr));
  const canister_string = Principal.fromUint8Array(thisArray).toText();
  return { canister_string, fee, symbol, decimal, standard };
}
