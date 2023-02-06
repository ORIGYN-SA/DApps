import React from 'react';
import { SnackbarProvider } from 'notistack';
import { themeLight, GlobalStyle } from '@origyn-sa/origyn-art-ui';
import { ThemeProvider } from 'styled-components';
import { HashRouter, Route, Routes } from 'react-router-dom';
import NFTPage from './pages/NFTPage';

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
