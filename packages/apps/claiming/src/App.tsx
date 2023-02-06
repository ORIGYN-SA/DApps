import React from 'react';
import { SnackbarProvider } from 'notistack';
import { themeLight, GlobalStyle } from '@origyn-sa/origyn-art-ui';
import { ThemeProvider } from 'styled-components';
import { HashRouter, Route, Routes } from 'react-router-dom';
import NFTPage from './pages/NFTPage';
import { SiteProvider } from '@dapp/features-theme';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';

const App = () => {
  return (
    <HashRouter>Í
      <SnackbarProvider maxSnack={3}>
        <ThemeProvider theme={themeLight}>
          <GlobalStyle />
          <Routes>
            <Route path="/" element={<NFTPage />} />
          </Routes>
        </ThemeProvider>
      </SnackbarProvider>
    </HashRouter>
  );
};

export default App;
