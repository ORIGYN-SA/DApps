import { SnackbarProvider } from 'notistack'
import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { AuthProvider } from '@dapp/features-authentication'
import Marketplace from './pages/Marketplace'
import { NFTPage } from '@dapp/features-sales-escrows'
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
                  <Route path="/" element={<Marketplace />} />
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
