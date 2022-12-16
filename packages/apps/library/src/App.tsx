import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import { SiteProvider } from '@dapp/features-theme'
import { AuthProvider, SessionProvider } from '@dapp/features-authentication'
import 'react-toastify/dist/ReactToastify.css'
// OLD HEADER PART
//import HeaderPart from './components/Header';
import { SnackbarProvider } from 'notistack'
import { TokensContextProvider } from '@dapp/features-tokens-provider'
import { Layout } from '@dapp/features-components'
import { Snackbar } from '@origyn-sa/origyn-art-ui'

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='*' element={<Login />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
