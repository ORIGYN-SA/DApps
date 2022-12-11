import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { SiteProvider } from '@dapp/features-theme';
import { AuthProvider, SessionProvider } from '@dapp/features-authentication';
import 'react-toastify/dist/ReactToastify.css';
// OLD HEADER PART
//import HeaderPart from './components/Header';
import { SnackbarProvider } from 'notistack';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import { Layout } from '@dapp/features-components';
const App = () => {
  return (
    <BrowserRouter>
        <SiteProvider>
          <SessionProvider>
            <AuthProvider>
                <TokensContextProvider>
                <SnackbarProvider maxSnack={3}>
                  <Layout>
                    <Routes>
                      <Route path="*" element={<Login />} />
                    </Routes>
                  </Layout>
                </SnackbarProvider>
                </TokensContextProvider>
            </AuthProvider>
          </SessionProvider>
        </SiteProvider>
    </BrowserRouter>
  );
};

export default App;
