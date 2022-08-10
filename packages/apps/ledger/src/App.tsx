import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Ledger from './pages/Ledger';
import { Layout } from '../src/components/layout';
import { AuthProvider } from '@dapp/features-authentication';
import { SiteProvider } from '@dapp/features-theme';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteProvider>
          <Layout>
            <Routes>
              <Route path="*" element={<Ledger />} />
            </Routes>
          </Layout>
        </SiteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
