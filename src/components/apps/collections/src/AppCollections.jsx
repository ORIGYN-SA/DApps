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
import Header from './components/Header/Header';

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
                  <Layout>
                    <div className="flex flex-col items-center w-full min-h-screen">
                      <Header />
                      <Routes>
                        <Route path="/" element={<CollectionsPage />} />
                        <Route path="/daos" element={<Daos />} />
                        <Route path="/collection/:id" element={<CollectionDetail />} />
                      </Routes>
                    </div>
                  </Layout>
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
