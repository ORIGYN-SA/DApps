import { Principal } from '@dfinity/principal';

// array without duplicates
export const removeDuplicates = (arr: string[]) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}
// type Account
export const getAccount = (
  accountPrincipalArray: { _arr },
  accountId: string,
  accountExtensible: string,
) => {
  if (accountPrincipalArray) {
    const thisArray = Uint8Array.from(Object.values(accountPrincipalArray._arr));
    const acc_principal_string = Principal.fromUint8Array(thisArray).toText();
    return { acc_principal_string, acc_id: accountId, acc_extensible: accountExtensible };
  }
}

export const getToken = (
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

export const getPrincipalAccountFromArray = (_Uint8Array: { _arr: [] }) => {
  const uint8Array = Uint8Array.from(Object.values(_Uint8Array._arr));
  const principalAccount = Principal.fromUint8Array(uint8Array);
  return principalAccount;
}
