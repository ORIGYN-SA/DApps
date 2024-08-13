import { CandyBytes } from '@dapp/common-types';

export function isNat8(number: number): boolean {
  return number >= 0 && number <= 255 && Number.isInteger(number);
}

export function convertNat8ArrayToCandyBytes(nat8Array: number[]): CandyBytes | undefined {
  let candyBytes: CandyBytes;

  if (!nat8Array.every(isNat8)) {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  candyBytes = {
    Bytes: nat8Array,
  };
}

export function convertBase64ToCandyBytes(base64: string): CandyBytes | undefined {
  let candyBytes: CandyBytes;
  const regex = /^[A-Za-z0-9+/]*={0,2}$/;
  try {
    if (regex.test(base64)) {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      if (limitByteArraySize(bytes, 16384)) {
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return (candyBytes = {
          Bytes: bytes,
        });
      } else {
        return undefined;
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export function convertHexadecimalToCandyBytes(hexadecimal: string): CandyBytes | undefined {
  const regex = /^[0-9a-fA-F]+$/;
  if (regex.test(hexadecimal)) {
    const bytes = new Uint8Array(
      hexadecimal.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? [],
    );
    return {
      Bytes: bytes,
    };
  }
  return undefined;
}

export function convertUint8ArrayToBase64(bytearray: Uint8Array | number[]): string {
  const base64 = btoa(String.fromCharCode(...bytearray));
  return base64;
}

export function convertUint8ArrayToHex(bytearray: Uint8Array | number[]): string {
  let hexString: string = '';
  bytearray.forEach((byte) => {
    const hex = byte.toString(16);
    hexString += hex.length === 1 ? '0' + hex : hex;
  });
  return hexString;
}

export function limitByteArraySize(
  byteArray: Uint8Array,
  maxByteArraySize: number,
): Uint8Array | undefined {
  if (byteArray.length > maxByteArraySize) {
    return undefined;
  } else {
    return byteArray;
  }
}
