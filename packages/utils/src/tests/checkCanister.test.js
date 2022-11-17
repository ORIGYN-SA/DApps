import { checkCanister } from '../checkCanister';

const VALID_CANISTER = 's32s7-zqaaa-aaaaj-afksa-cai';
const INVALID_CANISTER = 'hello';
const OGY_NON_NFT_CANISTER = 'nftforgood_uffc';
const EMPTY_FIELD = '';
describe ('utils > CheckCanister', () => {
  // test1
  it('Should return the canister string if the argument (canister) is valid', async () => {
    const checkedCanister = await checkCanister(VALID_CANISTER);
    expect(checkedCanister).toBe('s32s7-zqaaa-aaaaj-afksa-cai');
  });
  // test2
  it('Should return false if canister string is invalid', async () => {
    const checkedCanister = await checkCanister(INVALID_CANISTER);
    expect(checkedCanister).toBeFalsy;
  });
  // test3
  it('Should return false if canister is not an NFT canister', async () => {
    const checkedCanister = await checkCanister(OGY_NON_NFT_CANISTER);
    expect(checkedCanister).toBeFalsy;
  });
   // test4
   it('Should return false if canister is an empty string', async () => {
    const checkedCanister = await checkCanister(EMPTY_FIELD);
    expect(checkedCanister).toBeFalsy;
  });
});
