import { SnackbarProvider } from 'notistack';
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { NFTPage } from '@dapp/features-sales-escrows';
import { SiteProvider } from '@dapp/features-theme';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import Marketplace from './pages/Marketplace';
import { Layout } from '@dapp/features-components';
import { Connect2ICWrap } from '@dapp/features-authentication';

const App = () => (
  <HashRouter>
    <SiteProvider>
      <TokensContextProvider>
        <Connect2ICWrap>
          <SnackbarProvider maxSnack={3}>
            <Layout>
              <Routes>
                <Route path="/" element={<Marketplace />} />
                <Route path="/:nft_id" element={<NFTPage />} />
              </Routes>
            </Layout>
          </SnackbarProvider>
        </Connect2ICWrap>
      </TokensContextProvider>
    </SiteProvider>
  </HashRouter>
);

export default App;
