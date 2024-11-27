import { useEffect } from 'react'
import { Routes, Route, HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OGYCollectionDetails from './components/Pages/OGYCollectionDetails'
import DaoHome from './components/Pages/DaoHome'
import DaoDetails from './components/Pages/DaoDetails'
import NFTPage from './components/Pages/NFTPage'

import {
  OGY_LEDGER_CANISTER_ID,
  GLD_NFT_1G_CANISTER_ID,
  GLD_NFT_10G_CANISTER_ID,
  GLD_NFT_100G_CANISTER_ID,
  GLD_NFT_1000G_CANISTER_ID,
  LOGO_CANISTER_ID,
  ICPSWAP_TOKENS_CANISTER_ID,
  COLLECTIONS_INDEX_CANISTER_ID,
} from '@dapp/common-constants'

import { idlFactory as gld_nft_idl } from '../../../../packages/common/canisters/gld_nft/did'
import { idlFactory as gldt_swap_tokens_idl } from '../../../../packages/common/canisters/icpswap/store.did'
import { idlFactory as logo_idl } from '../../../../packages/common/canisters/icpswap/info.did'
import { idlFactory as collections_idl } from '../../../../packages/common/canisters/collections/index'
import { idlFactory as ledger_idl } from '../../../../packages/common/canisters/ledger/did'

import { UserProfileProvider } from '@dapp/features-userprofile'
import { AuthProvider } from '@dapp/features-authentication'
import { TokenDataProvider } from '@dapp/features-tokensdata'

import '@nfid/identitykit/react/styles.css'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
})

const App = () => {
  useEffect(() => {
    document.title = 'The dApp - Origyn Collections'
  }, [])

  return (
    <>
      <HashRouter>
        <QueryClientProvider client={queryClient}>
          <TokenDataProvider>
            <AuthProvider
              targets={[
                GLD_NFT_1G_CANISTER_ID,
                GLD_NFT_10G_CANISTER_ID,
                GLD_NFT_100G_CANISTER_ID,
                GLD_NFT_1000G_CANISTER_ID,
                LOGO_CANISTER_ID,
                ICPSWAP_TOKENS_CANISTER_ID,
                COLLECTIONS_INDEX_CANISTER_ID,
                OGY_LEDGER_CANISTER_ID,
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
                ogy_ledger: {
                  canisterId: OGY_LEDGER_CANISTER_ID,
                  idlFactory: ledger_idl,
                },
              }}
            >
              <UserProfileProvider>
                <Routes>
                  {/* <Route path='/daos/:daos_id' element={<DaoHome />} />
                  <Route path='/daos/:daos_id/vote' element={<DaoDetails />} />
                  <Route path='/daos/:daos_id/vote/:proposal_id' element={<DaoVote />} /> */}
                  <Route path='/collection/:canister_id' element={<OGYCollectionDetails />} />
                  <Route path='/collection/:canister_id/:nft_id' element={<NFTPage />} />
                </Routes>
              </UserProfileProvider>
            </AuthProvider>
          </TokenDataProvider>
        </QueryClientProvider>
      </HashRouter>
    </>
  )
}

export default App
