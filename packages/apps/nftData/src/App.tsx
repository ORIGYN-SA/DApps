import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import {SiteProvider} from "./theme";
import {AuthProvider} from '@dapp/features-authentication';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteProvider>
          <Layout>
            <Routes>
              <Route path="*" element={<Login/>}/>
            </Routes>
          </Layout>
        </SiteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;