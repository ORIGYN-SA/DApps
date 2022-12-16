import React from 'react'
import { Routes, Route, HashRouter } from 'react-router-dom'
import Home from './pages/Home'
import { Layout } from '@dapp/features-components'
import { SiteProvider } from '@dapp/features-theme'
import 'react-toastify/dist/ReactToastify.css'
import { TokensContextProvider } from '@dapp/features-tokens-provider'
import { SnackbarProvider } from 'notistack'
import { MetaProvider } from './components/nftTabs/context'
import { AuthProvider, SessionProvider } from '@dapp/features-authentication'

const App = () => {
  return (
    <HashRouter>
      <Layout>
        <MetaProvider>
          <Routes>
            <Route path='*' element={<Home />} />
          </Routes>
        </MetaProvider>
      </Layout>
    </HashRouter>
  )
}

export default App
