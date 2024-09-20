import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';
import { SiteProvider } from '@dapp/features-theme';
import { Layout } from '@dapp/features-components';
import 'react-toastify/dist/ReactToastify.css';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { PerpetualOSContextProvider } from '@dapp/features-context-provider';
import { SnackbarProvider } from 'notistack';
import { GlobalStyle } from '@origyn/origyn-art-ui';
import CollectionsPage from './components/CollectionsPage';
import CollectionDetail from './components/CollectionDetail';
import Daos from './components/Daos';

const App = () => (
  <>
    <HashRouter>
      <GlobalStyle />
      <SiteProvider>
        <PerpetualOSContextProvider>
          <SessionProvider>
            <AuthProvider>
              <TokensContextProvider>
                <SnackbarProvider maxSnack={3}>
                  <Routes>
                    <Route path="/" element={<CollectionsPage />} />
                    <Route path="/daos" element={<Daos />} />
                    <Route path="/collection/:canister_id" element={<CollectionDetail />} />
                  </Routes>
                </SnackbarProvider>
              </TokensContextProvider>
            </AuthProvider>
          </SessionProvider>
        </PerpetualOSContextProvider>
      </SiteProvider>
    </HashRouter>
  </>
);

export default App;
