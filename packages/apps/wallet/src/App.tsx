import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@dapp/features-components'
import { NFTPage } from '@dapp/features-sales-escrows'
import Wallet from './pages/Wallet'

const App = () => (
  <HashRouter>
    <Layout>
      <Routes>
        <Route path='/' element={<Wallet />} />
        <Route path='/:nft_id' element={<NFTPage />} />
      </Routes>
    </Layout>
  </HashRouter>
)

export default App
