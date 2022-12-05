import { SnackbarProvider } from 'notistack';
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@dapp/features-components';
import { NFTPage } from '@dapp/features-sales-escrows';
import { SiteProvider } from '@dapp/features-theme';
import { TokensContextProvider } from '@dapp/features-tokens-provider';
import Wallet from './pages/Wallet/DashboardLocal';
import NFTCollectables from './components/NFTCollectabels';
import Collection from './components/Collection';
import Activity from './components/Activity';
import Theme from '../../../features/theme/src/styles/Theme';
import styled from "styled-components"
import Navbar from '../../../features/components/src/Layout/Navigation/Navbar';
import { SessionProvider, AuthProvider } from '@dapp/features-authentication';



const App = () => (
  <HashRouter>
    <SessionProvider>
    <AuthProvider>
      <Theme>
        <TokensContextProvider>
          <SnackbarProvider maxSnack={3}>
            <Navbar>
              <Routes>
                <Route path="/" element={<Wallet />} />
                <Route path="/:nft_id" element={<NFTPage />} />
                <Route path="/3" element={<NFTCollectables/>} />
                <Route path="/h" element={<Collection/>} />
                <Route path="/:activity" element={<Activity/>} />
              </Routes>
            </Navbar>
          </SnackbarProvider>
        </TokensContextProvider>
      </Theme>
    </AuthProvider>
    </SessionProvider>
  </HashRouter>
);

export default App;
