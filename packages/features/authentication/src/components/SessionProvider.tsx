import { createClient } from '@connect2ic/core';
import { Connect2ICProvider } from '@connect2ic/react';
import { defaultProviders } from '@connect2ic/core/providers';
import { origynNftIdl, origynLedgerIdl } from '@dapp/common-candid';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRoute } from '../hooks/useRoute';
import { isLocal } from '@dapp/utils';

const MAINNET_OGY_LEDGER_CANSITER = 'jwcfb-hyaaa-aaaaj-aac4q-cai';
const LOCAL_OGY_LEDGER_CANSITER = 'rno2w-sqaaa-aaaaa-aaacq-cai';

export const SessionContext = createContext(undefined);

export const useSessionContext = () => useContext(SessionContext);

export const SessionProvider: React.FC = ({ children }) => {
  const savedLocalDevelopment = localStorage.getItem('localDevelopment') ?? '';
  const [canisterId, setCanisterId] = useState('frfol-iqaaa-aaaaj-acogq-cai');
  const [localDevelopment, setLocalDevelopment] = useState(savedLocalDevelopment === 'true');
  const [ogyLedgerCanisterId, setOgyLedgerCanisterId] = useState(
    localDevelopment ? LOCAL_OGY_LEDGER_CANSITER : MAINNET_OGY_LEDGER_CANSITER,
  );
  const [tokenId, setTokenId] = useState('');

  useEffect(() => {
    useRoute().then(({ canisterId, tokenId }) => {
      setCanisterId(canisterId);
      setTokenId(tokenId);
    });
  }, []);

  useEffect(() => {
    const ids = window.location.pathname.split('/');
    const canisterPath = localStorage.getItem('canisterPath');
    const newCanisterPath = ids[2];
    if (canisterPath !== newCanisterPath) {
      localStorage.setItem('canisterPath', newCanisterPath);
      useRoute().then(({ canisterId, tokenId }) => {
        setCanisterId(canisterId);
        setTokenId(tokenId);
      });
    }
  }, [window.location.pathname]);

  useEffect(() => {
    localStorage.setItem('localDevelopment', localDevelopment.toString());
  }, [localDevelopment]);

  return (
    <SessionContext.Provider
      value={{
        canisterId,
        ogyLedgerCanisterId,
        tokenId,
        localDevelopment,
        setOgyLedgerCanisterId,
        setLocalDevelopment,
      }}
    >
      <Connect2ICProvider
        client={createClient({
          canisters: {
            ledger: {
              canisterId: ogyLedgerCanisterId,
              idlFactory: origynLedgerIdl,
            },
            nft: {
              canisterId,
              idlFactory: origynNftIdl,
            },
          },
          providers: defaultProviders,
          globalProviderConfig: {
            // The host
            host:
              isLocal && localDevelopment ? 'http://localhost:8000' : 'https://boundary.ic0.app',
            dev: isLocal && localDevelopment,
            whitelist: [canisterId, ogyLedgerCanisterId],
          },
        })}
      >
        {children}
      </Connect2ICProvider>
    </SessionContext.Provider>
  );
};
