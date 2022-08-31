import { checkCanister } from "../checkCanister";
import { TextDecoder } from "util";

const VALID_CANISTER = "s32s7-zqaaa-aaaaj-afksa-cai";

describe("utils > CheckCanister", () => {
  // test1
  it('Should return the canister string if the argument (canister) is valid', async () => {
    const checkedCanister = await checkCanister(VALID_CANISTER);
  expect(checkedCanister).toBe("s32s7-zqaaa-aaaaj-afksa-cai");
  });
});