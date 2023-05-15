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

  const globalProviderConfig = {
    host: getHttpAgentHost(context.isLocal),
    dev: context.isLocal,
    whitelist: [context.canisterId],
  };
  return (
    <Connect2ICProvider
      client={createClient({
        canisters: {
          nft: {
            canisterId: context.canisterId,
            idlFactory: origynNftIdl,
          },
        },
        providers: defaultProviders,
        globalProviderConfig,
      })}
    >
      {children}
    </Connect2ICProvider>
  );
};
