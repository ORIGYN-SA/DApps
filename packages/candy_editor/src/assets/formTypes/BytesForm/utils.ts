import { CandyNat8, CandyBytes } from '../../../types';

type CandyBytesType = 'thawed' | 'frozen';

// TODO: Ask James if the CandyNat8 validation must be done here or in the form.
export function convertNat8ArrayToCandyBytes(
    candyNat8Array: [CandyNat8],
    candyBytesType: CandyBytesType,
): CandyBytes | undefined {
    let candyBytes: CandyBytes;
    if (candyBytesType === 'thawed') {
        candyBytes = {
            Bytes: {
                thawed: candyNat8Array.map((candyNat8: CandyNat8) => candyNat8.Nat8),
            },
        };
        return candyBytes;
    } else if (candyBytesType === 'frozen') {
        candyBytes = {
            Bytes: {
                frozen: candyNat8Array.map((candyNat8: CandyNat8) => candyNat8.Nat8),
            },
        };
        return candyBytes;
    }
    return undefined;
}

export function convertCandyBytesToNat8Array(
    candyBytes: CandyBytes,
    candyBytesType: CandyBytesType,
): [CandyNat8] | undefined {
    let candyNat8Array: [CandyNat8];
    if (candyBytesType === 'thawed') {
        candyNat8Array.push(candyBytes.Bytes['thawed'].map((nat8: number) => ({ Nat8: nat8 })));
        return candyNat8Array;
    } else if (candyBytesType === 'frozen') {
        candyNat8Array.push(candyBytes.Bytes['frozen'].map((nat8: number) => ({ Nat8: nat8 })));
        return candyNat8Array;
    }
    return undefined;
}

export function deleteCandyNat8FromCandyBytes(
    candyBytes: CandyBytes,
    candyBytesType: CandyBytesType,
    candyNat8: CandyNat8,
): CandyBytes | undefined {
    let updatedCandyNat8Array: [CandyNat8];
    if (candyBytesType === 'thawed') {
        updatedCandyNat8Array = candyBytes.Bytes['thawed'].filter(
            (nat8: number) => nat8 !== candyNat8.Nat8,
        );
        return convertNat8ArrayToCandyBytes(updatedCandyNat8Array, candyBytesType);
    } else if (candyBytesType === 'frozen') {
        updatedCandyNat8Array = candyBytes.Bytes['frozen'].filter(
            (nat8: number) => nat8 !== candyNat8.Nat8,
        );
        return convertNat8ArrayToCandyBytes(updatedCandyNat8Array, candyBytesType);
    }
    return undefined;
}
