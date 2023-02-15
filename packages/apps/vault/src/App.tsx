import React from 'react';
import { SnackbarProvider } from 'notistack';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@dapp/features-components';
import { NFTPage } from '@dapp/features-sales-escrows';
import { SiteProvider } from '@dapp/features-theme';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import Wallet from './pages/Wallet';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';
import { VaultProvider } from './components/context';

const App = () => (
  <HashRouter>
    <SiteProvider>
      <SessionProvider>
        <AuthProvider>
          <TokensContextProvider>
            <SnackbarProvider maxSnack={3}>
              <VaultProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Wallet />} />
                    <Route path="/:nft_id" element={<NFTPage />} />
                  </Routes>
                </Layout>
              </VaultProvider>
            </SnackbarProvider>
          </TokensContextProvider>
        </AuthProvider>
      </SessionProvider>
    </SiteProvider>
  </HashRouter>
);

export default App;
