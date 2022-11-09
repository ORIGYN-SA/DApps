import { SnackbarProvider } from 'notistack';
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { NFTPage } from '@dapp/features-sales-escrows';
import { SiteProvider } from '@dapp/features-theme';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import Marketplace from './pages/Marketplace';
import Layout from './components/Layout';

const App = () => (
  <HashRouter>
    <SiteProvider>
      <TokensContextProvider>
        <SnackbarProvider maxSnack={3}>
          <Layout>
            <Routes>
              <Route path="/" element={<Marketplace />} />
              <Route path="/:nft_id" element={<NFTPage />} />
            </Routes>
          </Layout>
        </SnackbarProvider>
      </TokensContextProvider>
    </SiteProvider>
  </HashRouter>
);

export default App;
