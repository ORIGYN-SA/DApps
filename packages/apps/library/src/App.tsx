import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { SiteProvider } from '@dapp/features-theme';
import { AuthProvider } from '@dapp/features-authentication';
import 'react-toastify/dist/ReactToastify.css';
import HeaderPart from './components/Header';
import { SnackbarProvider } from 'notistack';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteProvider>
          <SnackbarProvider maxSnack={3}>
            <HeaderPart>
              <Routes>
                <Route path="*" element={<Login />} />
              </Routes>
            </HeaderPart>
          </SnackbarProvider>
        </SiteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
