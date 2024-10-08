import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';
import 'react-toastify/dist/ReactToastify.css';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { PerpetualOSContextProvider } from '@dapp/features-context-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TokenDataProvider } from './context/TokenDataContext';
import CollectionsPage from './components/Pages/CollectionsList';
import CollectionDetail from './components/Pages/CollectionDetail';
import Daos from './components/Pages/Daos';
import NFTPage from './components/Pages/NFTPage';
import ProfilePage from './components/Pages/ProfilePage';

const queryClient = new QueryClient();

const App = () => (
  <>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <TokenDataProvider>
          <PerpetualOSContextProvider>
            <SessionProvider>
              <AuthProvider>
                <TokensContextProvider>
                  <Routes>
                    <Route path="/" element={<CollectionsPage />} />
                    <Route path="/daos" element={<Daos />} />
                    <Route path="/collection/:canister_id" element={<CollectionDetail />} />
                    <Route path="/collection/:canister_id/:nft_id" element={<NFTPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </TokensContextProvider>
              </AuthProvider>
            </SessionProvider>
          </PerpetualOSContextProvider>
        </TokenDataProvider>
      </QueryClientProvider>
    </HashRouter>
  </>
);

export default App;
