import { SnackbarProvider } from 'notistack'
import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@dapp/features-components'
import Main from './pages/Main'
import NFTDetails from './pages/NFTDetails'

const App = () => (
  <HashRouter>
    <SnackbarProvider maxSnack={3}>
      <Layout>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/:nft_id' element={<NFTDetails />} />
        </Routes>
      </Layout>
    </SnackbarProvider>
  </HashRouter>
)

export default App
