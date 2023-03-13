import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';
import { SiteProvider } from '@dapp/features-theme';
import Ledger from './pages/Ledger';
import { Layout } from '@dapp/features-components';
import 'react-toastify/dist/ReactToastify.css';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { SnackbarProvider } from 'notistack';
import { GlobalStyle } from '@origyn/origyn-art-ui';

const App = () => (
  <HashRouter>
    <GlobalStyle />
    <SiteProvider>
      <SessionProvider>
        <AuthProvider>
          <TokensContextProvider>
            <SnackbarProvider maxSnack={3}>
              <Layout>
                <Routes>
                  <Route path="*" element={<Ledger />} />
                </Routes>
              </Layout>
            </SnackbarProvider>
          </TokensContextProvider>
        </AuthProvider>
      </SessionProvider>
    </SiteProvider>
  </HashRouter>
);

export default App;
