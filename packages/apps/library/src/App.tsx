import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { SiteProvider } from '@dapp/features-theme';
import 'react-toastify/dist/ReactToastify.css';
import HeaderPart from './components/Header';

const App = () => {
  return (
    <BrowserRouter>
      <SiteProvider>
        <HeaderPart>
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        </HeaderPart>
      </SiteProvider>
    </BrowserRouter>
  );
};

export default App;
