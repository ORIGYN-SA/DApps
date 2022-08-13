import { Principal } from '@dfinity/principal';

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
