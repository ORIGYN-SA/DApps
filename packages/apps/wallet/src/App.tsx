import { SnackbarProvider } from 'notistack'
import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@dapp/features-components'
import { AuthProvider } from '@dapp/features-authentication'
import Wallet from './pages/Wallet'
import NFTPage from './pages/NFTPage'
import { SiteProvider } from '@dapp/features-theme'
import { TokensContextProvider } from '@dapp/features-tokens-provider'

const App = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <SiteProvider>
          <TokensContextProvider>
            <SnackbarProvider maxSnack={3}>
              <Layout>
                <Routes>
                  <Route path="/" element={<Wallet />} />
                  <Route path="/:nft_id" element={<NFTPage />} />
                </Routes>
              </Layout>
            </SnackbarProvider>
          </TokensContextProvider>
        </SiteProvider>
      </AuthProvider>
    </HashRouter>
  )
}

export default App
