import { Actor, HttpAgent } from '@dfinity/agent';
import { origynLedgerIdl } from '@dapp/common-candid';

// mainnet
export const OGY_LEDGER_CANISTER_ID = process.env.LEDGER_CANISTER_ID || '';

export const getLedgerActor = (identity) => {
  const agent = new HttpAgent({
    identity,
    host: 'https://boundary.ic0.app/',
  });
  return Actor.createActor(origynLedgerIdl, {
    agent,
    canisterId: OGY_LEDGER_CANISTER_ID,
  });
};
