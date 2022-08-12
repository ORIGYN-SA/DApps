import { SnackbarProvider } from 'notistack'
import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@dapp/features-components'
import { AuthProvider } from '@dapp/features-authentication'
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
              <>
                <Routes>
                  <Route path="/" element={<NFTPage />} />
                </Routes>
              </>
            </SnackbarProvider>
          </TokensContextProvider>
        </SiteProvider>
      </AuthProvider>
    </HashRouter>
  )
}

export default App
