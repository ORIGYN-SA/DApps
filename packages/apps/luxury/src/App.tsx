import { SnackbarProvider } from 'notistack';
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import NFTPage from './pages/NFTPage';
import { SiteProvider } from '@dapp/features-theme';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';
import { Layout } from '@dapp/features-components';

const App = () => {
  return (
    <HashRouter>
      <SiteProvider>
        <SessionProvider>
          <AuthProvider>
            <TokensContextProvider>
              <SnackbarProvider maxSnack={3}>
                <Layout>
                  <Routes>
                    <Route path="/" element={<NFTPage />} />
                  </Routes>
                </Layout>
              </SnackbarProvider>
            </TokensContextProvider>
          </AuthProvider>
        </SessionProvider>
      </SiteProvider>
    </HashRouter>
  );
};

export default App;
