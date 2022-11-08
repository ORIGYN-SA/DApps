import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Home from './pages/Home';
import { Layout } from '@dapp/features-components';
import { SiteProvider } from '@dapp/features-theme';
import { AuthProvider } from '@dapp/features-authentication';
import 'react-toastify/dist/ReactToastify.css';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { SnackbarProvider } from 'notistack';
import { MetaProvider } from './components/nftTabs/context';

const App = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <SiteProvider>
          <TokensContextProvider>
            <SnackbarProvider maxSnack={3}>
              <MetaProvider>
                <Layout>
                  <Routes>
                    <Route path="*" element={<Home />} />
                  </Routes>
                </Layout>
              </MetaProvider>
            </SnackbarProvider>
          </TokensContextProvider>
        </SiteProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
