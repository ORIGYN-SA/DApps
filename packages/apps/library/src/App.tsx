import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import { SiteProvider } from '@dapp/features-theme'
import { AuthProvider } from '@dapp/features-authentication'
import 'react-toastify/dist/ReactToastify.css'
import HeaderPart from './components/Header'
import Library from './pages/Login'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteProvider>
          <HeaderPart>
            <Routes>
              <Route path="*" element={<Login />} />
            </Routes>
          </HeaderPart>
        </SiteProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
