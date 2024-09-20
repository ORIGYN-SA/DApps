import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';
import 'react-toastify/dist/ReactToastify.css';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { PerpetualOSContextProvider } from '@dapp/features-context-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CollectionsPage from './components/CollectionsPage';
import CollectionDetail from './components/CollectionDetail';
import Daos from './components/Daos';

const queryClient = new QueryClient();

const App = () => (
  <>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <PerpetualOSContextProvider>
          <SessionProvider>
            <AuthProvider>
              <TokensContextProvider>
                <Routes>
                  <Route path="/" element={<CollectionsPage />} />
                  <Route path="/daos" element={<Daos />} />
                  <Route path="/collection/:canister_id" element={<CollectionDetail />} />
                </Routes>
              </TokensContextProvider>
            </AuthProvider>
          </SessionProvider>
        </PerpetualOSContextProvider>
      </QueryClientProvider>
    </HashRouter>
  </>
);

export default App;
