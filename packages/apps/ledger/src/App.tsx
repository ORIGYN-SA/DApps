import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@dapp/features-authentication';
import { SiteProvider } from '@dapp/features-theme';
import Ledger from './pages/Ledger';
import { Layout } from './components/layout';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
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

export default App;
