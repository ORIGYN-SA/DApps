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
import { convertNat8ArrayToCandyBytes } from '../assets/formTypes/BytesForm/utils';
import { isInRange } from '../utils/functions';
import { Principal } from '@dfinity/principal';

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

describe('FormTypes > utils.ts', () => {
  it('convertNat8ArrayToCandyBytes > returns a CandyBytes', () => {
    expect(convertNat8ArrayToCandyBytes([1, 2, 10, 90, 89], 'frozen')).toEqual({
      Bytes: {
        frozen: [1, 2, 10, 90, 89],
      },
    });
    expect(convertNat8ArrayToCandyBytes([11, 22, 10, 90, 89], 'thawed')).toEqual({
      Bytes: {
        thawed: [11, 22, 10, 90, 89],
      },
    });
  });
  it('convertNat8ArrayToCandyBytes > returns undefined if a value in the array is not a Nat8', () => {
    expect(convertNat8ArrayToCandyBytes([1, 2, 10, 900, 89], 'frozen')).toBe(undefined);
    expect(convertNat8ArrayToCandyBytes([256, 220, 10, 90, 89], 'thawed')).toBe(undefined);
  });
});
