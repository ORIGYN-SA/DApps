import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';
import { SiteProvider } from '@dapp/features-theme';
import Ledger from './pages/Ledger';
import { Layout } from '@dapp/features-components';
import 'react-toastify/dist/ReactToastify.css';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { SnackbarProvider } from 'notistack';
import { RouteProvider } from '@dapp/features-authentication';


const App = () => (
  <HashRouter>
    <SiteProvider>
      <SessionProvider>
        <TokensContextProvider>
          <AuthProvider>
            <SnackbarProvider maxSnack={3}>
              <RouteProvider>
              <Layout>
                <Routes>
                  <Route path="*" element={<Ledger />} />
                </Routes>
              </Layout>
              </RouteProvider>
            </SnackbarProvider>
          </AuthProvider>
        </TokensContextProvider>
      </SessionProvider>
    </SiteProvider>
  </HashRouter>
);

export default App;
