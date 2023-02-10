import { CandyBytes } from '../../../types';
type CandyBytesType = 'thawed' | 'frozen';

export function isNat8(number: number): boolean {
    return number >= 0 && number <= 255 && Number.isInteger(number);
}

export function convertNat8ArrayToCandyBytes(
    nat8Array: [number],
    candyBytesType: CandyBytesType,
): CandyBytes | undefined {
    let candyBytes: CandyBytes;

    if (!nat8Array.every(isNat8)) {
        return undefined;
    }

    if (candyBytesType === 'thawed') {
        candyBytes = {
            Bytes: {
                thawed: nat8Array.map((number) => number),
            },
        };
        return candyBytes;
    } else if (candyBytesType === 'frozen') {
        candyBytes = {
            Bytes: {
                frozen: nat8Array.map((number) => number),
            },
        };
        return candyBytes;
    }
    return undefined;
}

export function convertCandyBytesToNat8Array(
    candyBytes: CandyBytes,
    candyBytesType: CandyBytesType,
): [number] | undefined {
    let nat8Array: [number];
    if (candyBytesType === 'thawed') {
        nat8Array.push(candyBytes.Bytes['thawed'].map((nat8: number) => nat8));
        return nat8Array;
    } else if (candyBytesType === 'frozen') {
        nat8Array.push(candyBytes.Bytes['frozen'].map((nat8: number) => nat8));
        return nat8Array;
    }
    return undefined;
}
