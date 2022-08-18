import { Principal } from '@dfinity/principal';

export const objPrincipal =(_Uint8Array: { principal: { _arr: [] } }) => {
    const thisArray = Uint8Array.from(Object.values(_Uint8Array.principal._arr));
    const acc_principal = Principal.fromUint8Array(thisArray);
    return acc_principal;
}
