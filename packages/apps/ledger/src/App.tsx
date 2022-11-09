import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { Connect2ICWrap } from '@dapp/features-authentication';
import { SiteProvider } from '@dapp/features-theme';
import Ledger from './pages/Ledger';
import { Layout } from '@dapp/features-components';
import 'react-toastify/dist/ReactToastify.css';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { SnackbarProvider } from 'notistack';

const App = () => (
  <HashRouter>
    <SiteProvider>
      <TokensContextProvider>
        <Connect2ICWrap>
          <SnackbarProvider maxSnack={3}>
            <Layout>
              <Routes>
                <Route path="*" element={<Ledger />} />
              </Routes>
            </Layout>
          </SnackbarProvider>
        </Connect2ICWrap>
      </TokensContextProvider>
    </SiteProvider>
  </HashRouter>
);

export default App;
