import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Ledger from "./pages/Ledger"
import { LedgerLayout } from '@dapp/features-components'
import { AuthProvider } from '@dapp/features-authentication'
import { SiteProvider } from '@dapp/features-theme';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteProvider>
          <LedgerLayout>
            <Routes>
              <Route path="*" element={<Ledger/>}/>
            </Routes>
          </LedgerLayout>
        </SiteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
