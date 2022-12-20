import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Home from './pages/Home';
import { Layout } from '@dapp/features-components';
import { SiteProvider } from '@dapp/features-theme';
import 'react-toastify/dist/ReactToastify.css';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { SnackbarProvider } from 'notistack';
import { MetaProvider } from './components/nftTabs/context';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';
import { GlobalStyle } from '@origyn-sa/origyn-art-ui'

const App = () => {
  return (
    <HashRouter>
      <GlobalStyle />
      <SiteProvider>
        <SessionProvider>
          <TokensContextProvider>
            <AuthProvider>
              <SnackbarProvider maxSnack={3}>
                  <Layout>
                    <MetaProvider>
                    <Routes>
                      <Route path="*" element={<Home />} />
                    </Routes>
                    </MetaProvider>
                  </Layout>
              </SnackbarProvider>
            </AuthProvider>
          </TokensContextProvider>
        </SessionProvider>
      </SiteProvider>
    </HashRouter>
  );
};

export default App;
