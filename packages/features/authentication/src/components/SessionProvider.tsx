import { createClient } from '@connect2ic/core';
import { defaultProviders } from '@connect2ic/core/providers';
import { Connect2ICProvider } from '@connect2ic/react';
import { origynNftIdl } from '@origyn/mintjs';
import { isLocal } from '@dapp/utils';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRoute } from '../hooks/useRoute';

export const SessionContext = createContext(undefined);

export const useSessionContext = () => useContext(SessionContext);

export const SessionProvider: React.FC = ({ children }) => {
  const savedLocalDevelopment = localStorage.getItem('localDevelopment') ?? '';
  const [canisterId, setCanisterId] = useState('loading');
  const [localDevelopment, setLocalDevelopment] = useState(savedLocalDevelopment === 'true');
  // const [dev, setDev] = useState(isLocal() && localDevelopment);
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

  const dev = isLocal() && localDevelopment;

  if (canisterId === 'loading') return <></>;
  return (
    <SessionContext.Provider
      value={{
        canisterId,
        tokenId,
        localDevelopment,
        setLocalDevelopment,
      }}
    >
      <Connect2ICProvider
        client={createClient({
          canisters: {
            nft: {
              canisterId,
              idlFactory: origynNftIdl,
            },
          },
          providers: defaultProviders,
          globalProviderConfig: {
            host: dev ? 'http://localhost:8000' : 'https://boundary.ic0.app',
            dev,
            whitelist: [canisterId],
          },
        })}
      >
        {children}
      </Connect2ICProvider>
    </SessionContext.Provider>
  );
};
