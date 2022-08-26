import { TypeTokenSpec } from '../functions/TableFunctions'
import testData from './data';

const Canister = testData.typeToken.canister;
const tokenObject = TypeTokenSpec(Canister, 'FeeHere', 'Ogy', 'DecimalHere', 'Standard');
const canisterString = '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe';
const expectedObj =  {
    canister_string: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
    fee: 'FeeHere',
    symbol: 'Ogy',
    decimal: 'DecimalHere',
    standard: 'Standard'
  }
describe('Utils > TypeTokenSpec', () => {
  it('should return the correct Canister String', () => {
    expect(tokenObject.canister_string).toBe(canisterString);
  });

  it('should return the correct Object', () => {
    expect(tokenObject).toMatchObject(expectedObj);
  });

});