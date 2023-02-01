import { SnackbarProvider } from 'notistack';
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@dapp/features-components';
import Management from './pages/Management';

const App = () => (
  <HashRouter>
    <SnackbarProvider maxSnack={3}>
      <Layout>
        <Routes>
          <Route path="/" element={<Management />} />
        </Routes>
      </Layout>
    </SnackbarProvider>
  </HashRouter>
);

export default App;
