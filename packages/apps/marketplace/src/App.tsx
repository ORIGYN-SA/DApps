import React from 'react';
import { SnackbarProvider } from 'notistack';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { NFTPage } from '@dapp/features-sales-escrows';
import { SiteProvider } from '@dapp/features-theme';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import Marketplace from './pages/Marketplace';
import { Layout } from '@dapp/features-components';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';
import { MarketplaceProvider } from './components/context';

const App = () => (
  <HashRouter>
    <SiteProvider>
      <SessionProvider>
        <TokensContextProvider>
          <AuthProvider>
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
          </AuthProvider>
        </TokensContextProvider>
      </SessionProvider>
    </SiteProvider>
  </HashRouter>
);

export default App;
