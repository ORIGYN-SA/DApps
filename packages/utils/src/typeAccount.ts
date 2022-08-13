import { Principal } from '@dfinity/principal';

export const TypeAccount = (
    acc_principal: { _arr },
    acc_id: string,
    acc_extensible: string,
) => {
    const thisArray = Uint8Array.from(Object.values(acc_principal._arr));
    const acc_principal_string = Principal.fromUint8Array(thisArray).toText();
    return { acc_principal_string, acc_id, acc_extensible };
}