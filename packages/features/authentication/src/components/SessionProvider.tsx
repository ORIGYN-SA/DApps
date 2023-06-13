import React, { useContext } from 'react';
import { Connect2ICProvider } from '@connect2ic/react';
import { createClient } from '@connect2ic/core';
import { defaultProviders } from '@connect2ic/core/providers';
import { idlFactory as origynNftIdl } from '@origyn/mintjs';
import { PerpetualOSContext } from '@dapp/features-context-provider';
import { getHttpAgentHost } from '@origyn/actor-reference';

export const SessionProvider: React.FC = ({ children }) => {
  const context = useContext(PerpetualOSContext);

  if (!context.canisterId) return <></>;

  const host = getHttpAgentHost(context.isLocal);

  const globalProviderConfig = {
    host,
    dev: context.isLocal,
    autoConnect: true,
    // eslint-disable-next-line
    ledgerCanisterId: process.env.ICP_LEDGER_CANISTER_ID,
    ledgerHost: host,
    whitelist: [context.canisterId],
  };

  console.log('SessionProvider -> globalProviderConfig', globalProviderConfig);

  const client = createClient({
    canisters: {
      nft: {
        canisterId: context.canisterId,
        idlFactory: origynNftIdl,
      },
    },
    providers: defaultProviders,
    globalProviderConfig,
  });

  return <Connect2ICProvider client={client}>{children}</Connect2ICProvider>;
};
