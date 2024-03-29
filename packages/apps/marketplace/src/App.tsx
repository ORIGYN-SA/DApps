import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { DebugProvider } from '@dapp/features-debug-provider';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { PerpetualOSContextProvider } from '@dapp/features-context-provider';
import { NFTPage } from '@dapp/features-sales-escrows';
import { SiteProvider } from '@dapp/features-theme';
import Marketplace from './pages/Marketplace';
import { Layout } from '@dapp/features-components';
import { MarketplaceProvider } from './components/context';

const App = () => (
  <HashRouter>
    <DebugProvider>
      <SiteProvider>
        <PerpetualOSContextProvider>
          <SessionProvider>
            <AuthProvider>
              <TokensContextProvider>
                <SnackbarProvider maxSnack={3}>
                  <MarketplaceProvider>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Marketplace />} />
                        <Route path="/:nft_id" element={<NFTPage />} />
                      </Routes>
                    </Layout>
                  </MarketplaceProvider>
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
