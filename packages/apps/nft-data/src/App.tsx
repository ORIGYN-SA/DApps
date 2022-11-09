import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Home from './pages/Home';
import { Layout } from '@dapp/features-components';
import { SiteProvider } from '@dapp/features-theme';
import 'react-toastify/dist/ReactToastify.css';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { SnackbarProvider } from 'notistack';
import { Connect2ICWrap } from '@dapp/features-authentication';

const App = () => {
  return (
    <HashRouter>
      <SiteProvider>
        <TokensContextProvider>
          <Connect2ICWrap>
            <SnackbarProvider maxSnack={3}>
              <Layout>
                <Routes>
                  <Route path="*" element={<Home />} />
                </Routes>
              </Layout>
            </SnackbarProvider>
          </Connect2ICWrap>
        </TokensContextProvider>
      </SiteProvider>
    </HashRouter>
  );
};

export default App;
