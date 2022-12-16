import { SnackbarProvider } from 'notistack'
import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@dapp/features-components'
import { NFTPage } from '@dapp/features-sales-escrows'
import { SiteProvider } from '@dapp/features-theme'
import { TokensContextProvider } from '@dapp/features-tokens-provider'
import Wallet from './pages/Wallet'
import { AuthProvider, SessionProvider } from '@dapp/features-authentication'

const App = () => (
  <HashRouter>
    <Layout>
      <SiteProvider>
        <SessionProvider>
          <AuthProvider>
            <TokensContextProvider>
              <SnackbarProvider maxSnack={3}>
                <Routes>
                  <Route path='/' element={<Wallet />} />
                  <Route path='/:nft_id' element={<NFTPage />} />
                </Routes>
              </SnackbarProvider>
            </TokensContextProvider>
          </AuthProvider>
        </SessionProvider>
      </SiteProvider>
    </Layout>
  </HashRouter>
)

export default App
