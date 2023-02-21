import {
  convertToCandyNat,
  convertToCandyNat8,
  convertToCandyNat16,
  convertToCandyNat32,
  convertToCandyNat64,
} from '../assets/formTypes/NatForms/converters';
import {
  convertToCandyInt,
  convertToCandyInt8,
  convertToCandyInt16,
  convertToCandyInt32,
  convertToCandyInt64,
} from '../assets/formTypes/IntForms/converters';
import { convertToCandyBool } from '../assets/formTypes/BoolForm/converters';
import { convertToCandyFloat } from '../assets/formTypes/FloatForm/converters';
import { convertToCandyPrincipal } from '../assets/formTypes/PrincipalForm/converters';
import { isInRange } from '../utils/functions';
import { Principal } from '@dfinity/principal';
import {
  isNat8,
  convertBase64ToCandyBytes,
  convertNat8ArrayToCandyBytes,
  convertHexadecimalToCandyBytes,
  convertUint8ArrayToBase64,
  convertUint8ArrayToHex,
} from '../assets/formTypes/BytesForm/utils';

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

describe('Utils > functions.ts', () => {
  it('isInRange > returns true for numbers within the range', () => {
    expect(isInRange(10, 0, 30)).toBe(true);
    expect(isInRange(5, 5, 5)).toBe(true);
  });

  it('isInRange > returns false for numbers outside the range', () => {
    expect(isInRange(0, 4, 9)).toBe(false);
    expect(isInRange(3, 9, 10)).toBe(false);
  });
});

describe('NatForms > converters.ts', () => {
  it('convertToCandyNat > returns a CandyNat object for valid natural number strings', () => {
    expect(convertToCandyNat('152661')).toEqual({ Nat: BigInt(152661) });
    expect(convertToCandyNat('1')).toEqual({ Nat: BigInt(1) });
    expect(convertToCandyNat('0')).toEqual({ Nat: BigInt(0) });
  });

  it('convertToCandyNat > returns undefined for non-natural number strings', () => {
    expect(convertToCandyNat('-645')).toBe(undefined);
    expect(convertToCandyNat('0.545')).toBe(undefined);
    expect(convertToCandyNat('helloWorld')).toBe(undefined);
  });

  it('convertToCandyNat8 > returns a CandyNat8 object for valid Nat8 number strings', () => {
    expect(convertToCandyNat8('152')).toEqual({ Nat8: Number(152) });
    expect(convertToCandyNat8('1')).toEqual({ Nat8: Number(1) });
    expect(convertToCandyNat8('0')).toEqual({ Nat8: Number(0) });
  });

  it('convertToCandyNat8 > returns undefined for non-Nat8 number strings', () => {
    expect(convertToCandyNat8('-645')).toBe(undefined);
    expect(convertToCandyNat8('0.545')).toBe(undefined);
    expect(convertToCandyNat8('helloWorld')).toBe(undefined);
    expect(convertToCandyNat8('256')).toBe(undefined);
  });

  it('convertToCandyNat16 > returns a CandyNat16 object for valid Nat16 number strings', () => {
    expect(convertToCandyNat16('152')).toEqual({ Nat16: Number(152) });
    expect(convertToCandyNat16('1')).toEqual({ Nat16: Number(1) });
    expect(convertToCandyNat16('51535')).toEqual({ Nat16: Number(51535) });
  });

  it('convertToCandyNat16 > returns undefined for non-Nat16 number strings', () => {
    expect(convertToCandyNat16('-645')).toBe(undefined);
    expect(convertToCandyNat16('0.545')).toBe(undefined);
    expect(convertToCandyNat16('helloWorld')).toBe(undefined);
    expect(convertToCandyNat16('65536')).toBe(undefined);
  });

  it('convertToCandyNat32 > returns a CandyNat32 object for valid Nat32 number strings', () => {
    expect(convertToCandyNat32('152')).toEqual({ Nat32: Number(152) });
    expect(convertToCandyNat32('1')).toEqual({ Nat32: Number(1) });
    expect(convertToCandyNat32('4294967295')).toEqual({ Nat32: Number(4294967295) });
  });

  it('convertToCandyNat32 > returns undefined for non-Nat32 number strings', () => {
    expect(convertToCandyNat32('-6')).toBe(undefined);
    expect(convertToCandyNat32('0.55')).toBe(undefined);
    expect(convertToCandyNat32('helloWorld')).toBe(undefined);
    expect(convertToCandyNat32('4294967296')).toBe(undefined);
  });

  it('convertToCandyNat64 > returns a CandyNat64 object for valid Nat64 number strings', () => {
    expect(convertToCandyNat64('0')).toEqual({ Nat64: 0n });
    expect(convertToCandyNat64('100')).toEqual({ Nat64: 100n });
    expect(convertToCandyNat64('18446744073709551615')).toEqual({ Nat64: 18446744073709551615n });
  });

  it('convertToCandyNat64 > returns undefined for non-Nat64 number strings', () => {
    expect(convertToCandyNat64('-6')).toBe(undefined);
    expect(convertToCandyNat64('0.55')).toBe(undefined);
    expect(convertToCandyNat64('helloWorld')).toBe(undefined);
    expect(convertToCandyNat64('18446744073709551616')).toBe(undefined);
  });
});

describe('IntForms > converters.ts', () => {
  it('convertToCandyInt > returns a CandyInt object for valid integer number strings', () => {
    expect(convertToCandyInt('152661')).toEqual({ Int: BigInt(152661) });
    expect(convertToCandyInt('1')).toEqual({ Int: BigInt(1) });
    expect(convertToCandyInt('0')).toEqual({ Int: BigInt(0) });
    expect(convertToCandyInt('-152661')).toEqual({ Int: BigInt(-152661) });
    expect(convertToCandyInt('-1')).toEqual({ Int: BigInt(-1) });
    expect(convertToCandyInt('-0')).toEqual({ Int: BigInt(0) });
  });

  it('convertToCandyInt > returns undefined for non-integer number strings', () => {
    expect(convertToCandyInt('0.545')).toBe(undefined);
    expect(convertToCandyInt('helloWorld')).toBe(undefined);
  });

  it('convertToCandyInt8 > returns a CandyInt8 object for valid Int8 number strings', () => {
    expect(convertToCandyInt8('127')).toEqual({ Int8: Number(127) });
    expect(convertToCandyInt8('1')).toEqual({ Int8: Number(1) });
    expect(convertToCandyInt8('0')).toEqual({ Int8: Number(0) });
    expect(convertToCandyInt8('-128')).toEqual({ Int8: Number(-128) });
    expect(convertToCandyInt8('-1')).toEqual({ Int8: Number(-1) });
    expect(convertToCandyInt8('0')).toEqual({ Int8: Number(0) });
  });

  it('convertToCandyInt8 > returns undefined for non-Int8 number strings', () => {
    expect(convertToCandyInt8('0.545')).toBe(undefined);
    expect(convertToCandyInt8('helloWorld')).toBe(undefined);
    expect(convertToCandyInt8('256')).toBe(undefined);
    expect(convertToCandyInt8('-129')).toBe(undefined);
  });

  it('convertToCandyInt16 > returns a CandyInt16 object for valid Int16 number strings', () => {
    expect(convertToCandyInt16('152')).toEqual({ Int16: Number(152) });
    expect(convertToCandyInt16('1')).toEqual({ Int16: Number(1) });
    expect(convertToCandyInt16('32767')).toEqual({ Int16: Number(32767) });
    expect(convertToCandyInt16('-152')).toEqual({ Int16: Number(-152) });
    expect(convertToCandyInt16('-1')).toEqual({ Int16: Number(-1) });
    expect(convertToCandyInt16('-32768')).toEqual({ Int16: Number(-32768) });
  });

  it('convertToCandyInt16 > returns undefined for non-Int16 number strings', () => {
    expect(convertToCandyInt16('0.545')).toBe(undefined);
    expect(convertToCandyInt16('helloWorld')).toBe(undefined);
    expect(convertToCandyInt16('32770')).toBe(undefined);
    expect(convertToCandyInt16('-32769')).toBe(undefined);
  });

  it('convertToCandyInt32 > returns a CandyInt32 object for valid Int32 number strings', () => {
    expect(convertToCandyInt32('152')).toEqual({ Int32: Number(152) });
    expect(convertToCandyInt32('1')).toEqual({ Int32: Number(1) });
    expect(convertToCandyInt32('2147483647')).toEqual({ Int32: Number(2147483647) });
    expect(convertToCandyInt32('-152')).toEqual({ Int32: Number(-152) });
    expect(convertToCandyInt32('-1')).toEqual({ Int32: Number(-1) });
    expect(convertToCandyInt32('-2147483648')).toEqual({ Int32: Number(-2147483648) });
  });

  it('convertToCandyInt32 > returns undefined for non-Int32 number strings', () => {
    expect(convertToCandyInt32('0.545')).toBe(undefined);
    expect(convertToCandyInt32('helloWorld')).toBe(undefined);
    expect(convertToCandyInt32('2147483649')).toBe(undefined);
    expect(convertToCandyInt32('-2147483649')).toBe(undefined);
  });

  it('convertToCandyInt64 > returns a CandyInt64 object for valid Int64 number strings', () => {
    expect(convertToCandyInt64('152')).toEqual({ Int64: 152n });
    expect(convertToCandyInt64('1')).toEqual({ Int64: 1n });
    expect(convertToCandyInt64('9223372036854775807')).toEqual({ Int64: 9223372036854775807n });
    expect(convertToCandyInt64('-152')).toEqual({ Int64: -152n });
    expect(convertToCandyInt64('-1')).toEqual({ Int64: -1n });
    expect(convertToCandyInt64('-9223372036854775808')).toEqual({ Int64: -9223372036854775808n });
  });

  it('convertToCandyInt64 > returns undefined for non-Int64 number strings', () => {
    expect(convertToCandyInt64('0.545')).toBe(undefined);
    expect(convertToCandyInt64('helloWorld')).toBe(undefined);
    expect(convertToCandyInt64('9223372036854775808')).toBe(undefined);
    expect(convertToCandyInt64('-9223372036854775809')).toBe(undefined);
  });
});

describe('BoolForm > converters.ts', () => {
  it('convertToCandyBool > returns a CandyBool object for valid boolean strings', () => {
    expect(convertToCandyBool('true')).toEqual({ Bool: true });
    expect(convertToCandyBool('false')).toEqual({ Bool: false });
  });

  it('convertToCandyBool > returns undefined for non-boolean strings', () => {
    expect(convertToCandyBool('true.')).toBe(undefined);
    expect(convertToCandyBool('invalidString')).toBe(undefined);
  });
});

describe('FloatForm > converters.ts', () => {
  it('convertToCandyFloat > returns a CandyFloat object for valid Float number strings', () => {
    expect(convertToCandyFloat('0.545')).toEqual({ Float: Number(0.545) });
    expect(convertToCandyFloat('1')).toEqual({ Float: Number(1) });
    expect(convertToCandyFloat('0')).toEqual({ Float: Number(0) });
    expect(convertToCandyFloat('-0.545')).toEqual({ Float: Number(-0.545) });
    expect(convertToCandyFloat('-3.4028234663852886e+38')).toEqual({
      Float: Number(-3.4028234663852886e38),
    });
  });

  it('convertToCandyFloat > returns undefined for non-Float number strings', () => {
    expect(convertToCandyFloat('helloWorld')).toBe(undefined);
    expect(convertToCandyFloat('5,55')).toBe(undefined);
  });
});

describe('PrincipalForm > converters.ts', () => {
  it('convertToCandyPrincipal > returns a CandyPrincipal object for valid Principal strings', () => {
    expect(
      convertToCandyPrincipal('6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe'),
    ).toEqual({
      Principal: Principal.fromText(
        '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
      ),
    });
    expect(
      convertToCandyPrincipal('no6lb-7zlb2-rky7d-pxic6-dyqdb-e73ho-4znjc-gw47r-tfm7e-xwpuu-wqe'),
    ).toEqual({
      Principal: Principal.fromText(
        'no6lb-7zlb2-rky7d-pxic6-dyqdb-e73ho-4znjc-gw47r-tfm7e-xwpuu-wqe',
      ),
    });
  });

  it('convertToCandyPrincipal > returns undefined for non-Principal strings', () => {
    expect(
      convertToCandyPrincipal('6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7q5'),
    ).toBe(undefined);
    expect(
      convertToCandyPrincipal('no6lb-7zlb2-rky7d-pxic6-diqdb-e73ho-4znjc-gw47r-tfm7e-xwpuu-wqe'),
    ).toBe(undefined);
  });
});
