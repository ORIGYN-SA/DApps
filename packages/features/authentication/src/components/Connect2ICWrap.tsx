import { createClient } from '@connect2ic/core';
import { Connect2ICProvider } from '@connect2ic/react';
import { defaultProviders } from '@connect2ic/core/providers';
import { origynNftIdl, origynLedgerIdl } from '@dapp/common-candid';
import React, { useEffect, useState } from 'react';
import { useRoute } from '../hooks/useRoute';
import { AuthProvider } from './AuthProvider';

const OGY_LEDGER_CANSITER = 'jwcfb-hyaaa-aaaaj-aac4q-cai';

export const Connect2ICWrap: React.FC = ({ children }) => {
  const [canisterId, setCanisterId] = useState('frfol-iqaaa-aaaaj-acogq-cai');
  const [tokenId, setTokenId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    useRoute().then(({ canisterId, tokenId }) => {
      setCanisterId(canisterId);
      setTokenId(tokenId);
      setLoading(false);
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

  return (
    <Connect2ICProvider
      client={createClient({
        canisters: {
          ledger: {
            canisterId: OGY_LEDGER_CANSITER,
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
          host: 'https://boundary.ic0.app',
          dev: false,
          whitelist: [canisterId, OGY_LEDGER_CANSITER],
        },
      })}
    >
      <AuthProvider canisterId={canisterId} tokenId={tokenId}>
        {children}
      </AuthProvider>
    </Connect2ICProvider>
  );
};
