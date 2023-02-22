import {
  isNat8,
  convertBase64ToCandyBytes,
  convertNat8ArrayToCandyBytes,
  convertHexadecimalToCandyBytes,
  convertUint8ArrayToBase64,
  convertUint8ArrayToHex,
} from '@dapp/utils-binary-converters';

describe('BytesForms > utils.ts', () => {
  test('convertUint8ArrayToHex > converts a Uint8Array to a hexadecimal string', () => {
    const bytes = new Uint8Array([1, 255, 16, 128]);
    const hexString = convertUint8ArrayToHex(bytes);
    expect(hexString).toBe('01ff1080');
  });

  test('convertUint8ArrayToBase64 > should convert Uint8Array to base64 string', () => {
    const bytes = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]);
    const expectedBase64 = 'SGVsbG8gV29ybGQ=';

    const result = convertUint8ArrayToBase64(bytes);

    expect(result).toEqual(expectedBase64);
  });

  test('convertUint8ArrayToBase64 > should return empty string when input array is empty', () => {
    const bytes = new Uint8Array([]);
    const expectedBase64 = '';

    const result = convertUint8ArrayToBase64(bytes);

    expect(result).toEqual(expectedBase64);
  });

  test('convertUint8ArrayToBase64 > isNat8 should return true for a natural number between 0 and 255', () => {
    expect(isNat8(0)).toBe(true);
    expect(isNat8(255)).toBe(true);
    expect(isNat8(128)).toBe(true);
  });

  test('isNat8 > should return false for a number outside the range of 0 to 255', () => {
    expect(isNat8(-1)).toBe(false);
    expect(isNat8(256)).toBe(false);
  });

  test('isNat8 > should return false for a non-integer number', () => {
    expect(isNat8(1.5)).toBe(false);
    expect(isNat8(0.1)).toBe(false);
  });

  it('convertNat8ArrayToCandyBytes > should return undefined if input array contains non-8-bit numbers', () => {
    const inputArray = [0, 255, 300]; // contains non-8-bit number 300
    const result = convertNat8ArrayToCandyBytes(inputArray, 'thawed');
    expect(result).toBeUndefined();
  });

  it('convertNat8ArrayToCandyBytes > should return a CandyBytes object with "thawed" property if input candyBytesType is "thawed"', () => {
    const inputArray = [0, 255, 127];
    const result = convertNat8ArrayToCandyBytes(inputArray, 'thawed');
    expect(result).toEqual({
      Bytes: {
        thawed: [0, 255, 127],
      },
    });
  });

  it('convertNat8ArrayToCandyBytes > should return a CandyBytes object with "frozen" property if input candyBytesType is "frozen"', () => {
    const inputArray = [127, 255, 0];
    const result = convertNat8ArrayToCandyBytes(inputArray, 'frozen');
    expect(result).toEqual({
      Bytes: {
        frozen: [127, 255, 0],
      },
    });
  });

  it('convertNat8ArrayToCandyBytes > should return undefined if input candyBytesType is not "thawed" or "frozen"', () => {
    const inputArray = [0, 127, 255];
    const result = convertNat8ArrayToCandyBytes(inputArray, 'invalid-type');
    expect(result).toBeUndefined();
  });

  it('convertBase64ToCandyBytes > should return undefined if input base64 is invalid', () => {
    const invalidBase64 = 'invalid-base64-+';
    const result = convertBase64ToCandyBytes(invalidBase64, 'thawed');
    expect(result).toBeUndefined();
  });

  it('convertBase64ToCandyBytes > should return undefined if the byte array size exceeds the limit', () => {
    // create a base64 string that will result in a byte array exceeding the limit of 16384 bytes
    const largeBase64 = Buffer.alloc(16385).toString('base64');
    const result = convertBase64ToCandyBytes(largeBase64, 'thawed');
    expect(result).toBeUndefined();
  });

  it('convertBase64ToCandyBytes > should return a CandyBytes object with "thawed" property if input candyBytesType is "thawed"', () => {
    const inputBase64 = 'AQIDBA=='; // base64 representation of [1, 2, 3, 4]
    const result = convertBase64ToCandyBytes(inputBase64, 'thawed');
    expect(result).toEqual({
      Bytes: {
        thawed: [1, 2, 3, 4],
      },
    });
  });

  it('convertBase64ToCandyBytes > should return undefined if an error occurs during base64 decoding', () => {
    const inputBase64 = 'invalid=base64'; // invalid base64 with "=" at a non-padding position
    const result = convertBase64ToCandyBytes(inputBase64, 'thawed');
    expect(result).toBeUndefined();
  });

  test('convertHexadecimalToCandyBytes > returns CandyBytes object for valid input with thawed type', () => {
    const input = '0a2b3c';
    const expectedOutput = {
      Bytes: {
        thawed: [10, 43, 60],
      },
    };
    const result = convertHexadecimalToCandyBytes(input, 'thawed');
    expect(result).toEqual(expectedOutput);
  });

  test('convertHexadecimalToCandyBytes > returns undefined for input with odd number of characters', () => {
    const input = '0a2b3';
    const result = convertHexadecimalToCandyBytes(input, 'frozen');
    expect(result).toBeUndefined();
  });
});
