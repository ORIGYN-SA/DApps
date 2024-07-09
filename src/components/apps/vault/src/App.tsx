import React from 'react';
import { SnackbarProvider } from 'notistack';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { DebugProvider } from '@dapp/features-debug-provider';
import { Layout } from '@dapp/features-components';
import { NFTPage } from '@dapp/features-sales-escrows';
import { SiteProvider } from '@dapp/features-theme';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { PerpetualOSContextProvider } from '@dapp/features-context-provider';
import VaultPage from './pages/Vault';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';
import { VaultProvider } from './components/context';

const App = () => (
  <HashRouter>
    <DebugProvider>
      <SiteProvider>
        <PerpetualOSContextProvider>
          <SessionProvider>
            <AuthProvider>
              <TokensContextProvider>
                <SnackbarProvider maxSnack={3}>
                  <VaultProvider>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<VaultPage />} />
                        <Route path="/:nft_id" element={<NFTPage />} />
                      </Routes>
                    </Layout>
                  </VaultProvider>
                </SnackbarProvider>
              </TokensContextProvider>
            </AuthProvider>
          </SessionProvider>
        </PerpetualOSContextProvider>
      </SiteProvider>
    </DebugProvider>
  </HashRouter>
);

export default App;
