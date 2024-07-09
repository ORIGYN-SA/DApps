import { getAccountId } from '../principalToAccountID';
import { Principal } from '@dfinity/principal';

describe('Utils > Principal to Account ID', () => {
  it('should return the correct account id', () => {
    const INPUT_TEST_PRINCIPAL = 'jvdm5-xkwgc-4t2x7-ojmjd-ail2p-6agif-7m6a6-z6eok-oxueq-inzfb-zae';
    const RESULT = '8a378c56b8309892d4ab8b73672eeb25ae362cd5cad4235e23b80547b3d4ab1f';

    const principal = Principal.fromText(INPUT_TEST_PRINCIPAL);
    const accountId = getAccountId(principal);
    expect(accountId).toBe(RESULT);
  });
});
