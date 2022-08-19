import { getAccountId } from '../principalToAccountID';
import { Principal } from '@dfinity/principal';

describe('Utils > Principal to Account ID', () => {
  it('should return the correct account id', () => {
    const INPUT_TEST_PRINCIPAL = 'jvdm5-xkwgc-4t2x7-ojmjd-ail2p-6agif-7m6a6-z6eok-oxueq-inzfb-zae';
    const RESULT = 'a75ce19444eafa373ce5b155eb401d9fe2175fae4a3b01de4e0a1e85bb753688';

    const principal = Principal.fromText(INPUT_TEST_PRINCIPAL);
    const accountId = getAccountId(principal);
    expect(accountId).toBe(RESULT);
  });
});
