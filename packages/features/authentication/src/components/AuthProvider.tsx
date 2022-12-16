import React from 'react';
import { ConnectDialog, useCanister, useConnect } from '@connect2ic/react';
import { Preloader } from '@dapp/features-components';
import { Principal } from '@dfinity/principal';
import { createContext, useContext } from 'react';
import { AuthContextType } from '../types';
import styled from 'styled-components'
import { Button } from '@origyn-sa/origyn-art-ui'

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  isLoading: false,
});

export const useAuthContext = () => useContext(AuthContext);

export const useAuth = () => {
  const {
    activeProvider: activeWalletProvider,
    principal,
    disconnect: handleLogOut,
    isInitializing,
    isConnected,
    ...other
  } = useConnect();
  const [actor] = useCanister('nft');

  return {
    activeWalletProvider,
    actor,
    handleLogOut,
    other,
    isLoading: isInitializing,
    loggedIn: isConnected,
    principal: principal?.length > 0 ? Principal.fromText(principal) : Principal.anonymous(),
  };
};

const StyledPlugNotification = styled.div`
  position: absolute;
  top: 50px;
  right: 50px;
  border-width: 4px;
  border-style: solid;
  padding: 16px;
  border-image: linear-gradient(96.38deg, rgb(255, 231, 1) -0.67%, rgb(250, 81, 211) 31.53%, rgb(16, 217, 237) 61.61%, rgb(95, 255, 96) 100.67%) 1;
`

const PlugNotification = ({logOut}) => {

  return <StyledPlugNotification>
    <p>Connecting to your wallet</p>
    <br/>
    <p>If you are using Plug</p>
    <h6>Make sure your are logged in your Plug Extension! ^</h6>
  </StyledPlugNotification>
}

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  return (
    <>
      <ConnectDialog />
      {auth.isLoading ? (
        <>
          <Preloader width="100%" />
          {window.ic.plug.sessionManager.initialized ? <PlugNotification logOut={auth.other.cancelConnect} /> : ""}
        </>
      ) : (
        <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
      )}
    </>
  );
};
