import { TypeAccount } from '../typeAccount';
import testData from './data';

const Principal = testData.typeAccount.canister;
const accountObject = TypeAccount(Principal,"Id","Ext")
const acc_principal = '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe';

describe('Utils > TypeAccount', () => {
  it('should return the correct Account ID', () => {
    expect(accountObject.acc_principal_string).toBe(acc_principal);
  });

});