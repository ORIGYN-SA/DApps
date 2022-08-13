import { Principal } from '@dfinity/principal';
export const formatPrincipal = (_Uint8Array: { principal: { _arr: [] } }) => {
    const thisArray = Uint8Array.from(Object.values(_Uint8Array.principal._arr));
    const acc_principal_string = Principal.fromUint8Array(thisArray).toText();
    return acc_principal_string;
}
