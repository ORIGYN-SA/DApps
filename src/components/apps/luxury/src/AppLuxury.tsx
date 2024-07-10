import { SnackbarProvider } from 'notistack';
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import NFTPage from './pages/NFTPage';
import { SiteProvider } from '@dapp/features-theme';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { PerpetualOSContextProvider } from '@dapp/features-context-provider';

const App = () => {
  return (
    <HashRouter>
      <SiteProvider>
        <PerpetualOSContextProvider>
          <TokensContextProvider>
            <SnackbarProvider maxSnack={3}>
              <>
                <Routes>
                  <Route path="/" element={<NFTPage />} />
                </Routes>
              </>
            </SnackbarProvider>
          </TokensContextProvider>
        </PerpetualOSContextProvider>
      </SiteProvider>
    </HashRouter>
  );
};

export default App;
