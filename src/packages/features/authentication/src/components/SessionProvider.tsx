import React, { useContext } from 'react';
import { getHttpAgentHost } from '@origyn/actor-reference';
import { PerpetualOSContext } from '@dapp/features-context-provider';
import { idlFactory as origynNftIdl } from '@origyn/mintjs';

import { Connect2ICProvider } from '@connect2ic/react';
import { createClient } from '@connect2ic/core';

import { InternetIdentity } from '@connect2ic/core/providers/internet-identity';
import { PlugWallet } from '@connect2ic/core/providers/plug-wallet';
import { NFID } from '@connect2ic/core/providers/nfid';
import { InfinityWallet } from '@connect2ic/core/providers/infinity-wallet';
import { StoicWallet } from '@connect2ic/core/providers/stoic-wallet';

interface SessionProviderProps {
  children: any;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
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

  const client = createClient({
   
    canisters: {
      nft: {
        canisterId: context.canisterId,
        idlFactory: origynNftIdl,
      },
    },
    providers: [
      // authentication with local deployment only supported by II and Plug
      // eslint-disable-next-line
      new InternetIdentity({ ...globalProviderConfig, providerUrl: process.env.II_PROVIDER }),
      new PlugWallet(globalProviderConfig),
      // local auth requires local deployment of NFID canister and updated providerUrl
      new NFID(globalProviderConfig),
      new InfinityWallet(globalProviderConfig),
      new StoicWallet(globalProviderConfig),
    ],
    globalProviderConfig,
  });

  return <Connect2ICProvider client={client}>{children}</Connect2ICProvider>;
};
