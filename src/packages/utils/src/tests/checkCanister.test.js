import { validateCanisterOrCollectionId } from '../checkCanister';

const VALID_CANISTER = 'mludz-biaaa-aaaal-qbhwa-cai';
const INVALID_CANISTER = 'hello';
const OGY_NON_NFT_CANISTER = 'nftforgood_uffc';
const EMPTY_FIELD = '';
describe('utils > CheckCanister', () => {
  // test1
  it('Should return the canister string if the argument (canister) is valid', async () => {
    const checkedCanister = await validateCanisterOrCollectionId(VALID_CANISTER, true);
    expect(checkedCanister).toBe('mludz-biaaa-aaaal-qbhwa-cai');
  });
  // test2
  it('Should return false if canister string is invalid', async () => {
    const checkedCanister = await validateCanisterOrCollectionId(INVALID_CANISTER, true);
    expect(checkedCanister).toBeFalsy;
  });
  // test3
  it('Should return false if canister is not an NFT canister', async () => {
    const checkedCanister = await validateCanisterOrCollectionId(OGY_NON_NFT_CANISTER, true);
    expect(checkedCanister).toBeFalsy;
  });
  // test4
  it('Should return false if canister is an empty string', async () => {
    const checkedCanister = await validateCanisterOrCollectionId(EMPTY_FIELD, true);
    expect(checkedCanister).toBeFalsy;
  });
});
