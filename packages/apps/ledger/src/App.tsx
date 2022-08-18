import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { AuthProvider } from '@dapp/features-authentication';
import { SiteProvider } from '@dapp/features-theme';
import Ledger from './pages/Ledger';
import { Layout } from '@dapp/features-components';
import 'react-toastify/dist/ReactToastify.css';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { SnackbarProvider } from 'notistack';

const App = () => (
  <HashRouter>
    <AuthProvider>
      <SiteProvider>
        <TokensContextProvider>
          <SnackbarProvider maxSnack={3}>
            <Layout>
              <Routes>
                <Route path="*" element={<Ledger />} />
              </Routes>
            </Layout>
          </SnackbarProvider>
        </TokensContextProvider>
      </SiteProvider>
    </AuthProvider>
  </HashRouter>
);

export default App;
