import { checkCanister } from "../checkCanister";

const VALID_CANISTER = "s32s7-zqaaa-aaaaj-afksa-cai";
const INVALID_CANISTER = "hello";
const OGY_NONFT_CANISTER = "nftforgood_uffc";
describe("utils > CheckCanister", () => {
  // test1
  it('Should return the canister string if the argument (canister) is valid', async () => {
    const checkedCanister = await checkCanister(VALID_CANISTER);
  expect(checkedCanister).toBe("s32s7-zqaaa-aaaaj-afksa-cai");
  });
});