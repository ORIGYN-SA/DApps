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

export function convertNatTocandyBytes(
    nat: bigint,
    candyBytesType: CandyBytesType,
): CandyBytes | undefined {
    let candyBytes: CandyBytes;
    let nat8Array: [number] = natToBytes(nat);
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

function natToBytes(natNumber: bigint): [number] {
    let binary = natNumber.toString(2);
    let padding = 8 - binary.length % 8;
    if (padding !== 8) {
        binary = Array(padding + 1).join('0') + binary;
    }
    let bytes: [number] = null;
    for (let i = 0; i < binary.length; i += 8) {
        bytes.push(parseInt(binary.substr(i, 8), 2));
    }
    return bytes;
}


