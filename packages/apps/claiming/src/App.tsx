import React from 'react';
import { SnackbarProvider } from 'notistack';
import { themeLight, GlobalStyle } from '@origyn-sa/origyn-art-ui';
import { ThemeProvider } from 'styled-components';
import { HashRouter, Route, Routes } from 'react-router-dom';
import NFTPage from './pages/NFTPage';
import ClaimPage from './pages/ClaimPage';
import { SiteProvider } from '@dapp/features-theme';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';

const App = () => {
  return (
    <HashRouter>
      <SiteProvider>
        <SessionProvider>
          <AuthProvider>
            <TokensContextProvider>
              <SnackbarProvider maxSnack={3}>
                <ThemeProvider theme={themeLight}>
                  <GlobalStyle />
                  <Routes>
                    <Route path="/" element={<NFTPage />} />
                    <Route path="/claim" element={<ClaimPage />} />
                  </Routes>
                </ThemeProvider>
              </SnackbarProvider>
            </TokensContextProvider>
          </AuthProvider>
        </SessionProvider>
      </SiteProvider>
    </HashRouter>
  );
};

export default App;
