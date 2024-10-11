import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TokenDataProvider } from './context/TokenDataContext';
import { UserProfileProvider } from './context/UserProfileContext';
import CollectionsPage from './components/Pages/CollectionsList';
import CollectionDetail from './components/Pages/CollectionDetail';
import Daos from './components/Pages/Daos';
import NFTPage from './components/Pages/NFTPage';
import ProfilePage from './components/Pages/ProfilePage';
import {
  GLD_NFT_1G_CANISTER_ID,
  GLD_NFT_10G_CANISTER_ID,
  GLD_NFT_100G_CANISTER_ID,
  GLD_NFT_1000G_CANISTER_ID,
  LOGO_CANISTER_ID,
  ICPSWAP_TOKENS_CANISTER_ID,
  COLLECTIONS_INDEX_CANISTER_ID,
} from './constants';

import { idlFactory as gld_nft_idl } from './canisters/gld_nft/did';
import { idlFactory as gldt_swap_tokens_idl } from './canisters/icpswap/store.did';
import { idlFactory as logo_idl } from './canisters/icpswap/info.did';
import { idlFactory as collections_idl } from './canisters/collections/index';
import { AuthProvider } from './auth';

import '@nfid/identitykit/react/styles.css';

const queryClient = new QueryClient();

const App = () => (
  <>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider
          targets={[
            GLD_NFT_1G_CANISTER_ID,
            GLD_NFT_10G_CANISTER_ID,
            GLD_NFT_100G_CANISTER_ID,
            GLD_NFT_1000G_CANISTER_ID,
            LOGO_CANISTER_ID,
            ICPSWAP_TOKENS_CANISTER_ID,
            COLLECTIONS_INDEX_CANISTER_ID,
          ]}
          canisters={{
            gld_nft_1g: {
              canisterId: GLD_NFT_1G_CANISTER_ID,
              idlFactory: gld_nft_idl,
            },
            gld_nft_10g: {
              canisterId: GLD_NFT_10G_CANISTER_ID,
              idlFactory: gld_nft_idl,
            },
            gld_nft_100g: {
              canisterId: GLD_NFT_100G_CANISTER_ID,
              idlFactory: gld_nft_idl,
            },
            gld_nft_1000g: {
              canisterId: GLD_NFT_1000G_CANISTER_ID,
              idlFactory: gld_nft_idl,
            },
            logo: {
              canisterId: LOGO_CANISTER_ID,
              idlFactory: logo_idl,
            },
            icp_swap_tokens: {
              canisterId: ICPSWAP_TOKENS_CANISTER_ID,
              idlFactory: gldt_swap_tokens_idl,
            },
            collection_index: {
              canisterId: COLLECTIONS_INDEX_CANISTER_ID,
              idlFactory: collections_idl,
            },
          }}
        >
          <TokenDataProvider>
            <UserProfileProvider>
              <Routes>
                <Route path="/" element={<CollectionsPage />} />
                <Route path="/daos" element={<Daos />} />
                <Route path="/collection/:canister_id" element={<CollectionDetail />} />
                <Route path="/collection/:canister_id/:nft_id" element={<NFTPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </UserProfileProvider>
          </TokenDataProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HashRouter>
  </>
);

export default App;
