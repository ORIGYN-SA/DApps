import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Home from './pages/Home';
import { Layout } from '@dapp/features-components';
import { SiteProvider } from '@dapp/features-theme';
import 'react-toastify/dist/ReactToastify.css';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { PerpetualOSContextProvider } from '@dapp/features-context-provider';
import { SnackbarProvider } from 'notistack';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';
import { GlobalStyle } from '@origyn/origyn-art-ui';

const App = () => {
  return (
    <HashRouter>
      <GlobalStyle />
      <SiteProvider>
        <PerpetualOSContextProvider>
          <SessionProvider>
            <TokensContextProvider>
              <AuthProvider>
                <SnackbarProvider maxSnack={3}>
                  <Layout>
                    <Routes>
                      <Route path="*" element={<Home />} />
                    </Routes>
                  </Layout>
                </SnackbarProvider>
              </AuthProvider>
            </TokensContextProvider>
          </SessionProvider>
        </PerpetualOSContextProvider>
      </SiteProvider>
    </HashRouter>
  );
};

export default App;
