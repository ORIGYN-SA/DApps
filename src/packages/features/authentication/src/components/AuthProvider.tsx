import React, { createContext } from 'react';
import { Principal } from '@dfinity/principal';
import { ConnectDialog, useCanister, useConnect } from '@connect2ic/react';
import { OrigynNftActor } from '@origyn/mintjs';
import { Preloader } from '@dapp/features-components';
import { AuthContextType } from '../types';
import styled from 'styled-components';
import PropTypes from 'prop-types';

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  isLoading: false,
  principalId: '',
});

export const useAuth = (): AuthContextType => {
  const {
    activeProvider: activeWalletProvider,
    principal: principalId,
    disconnect: handleLogOut,
    isInitializing,
    isConnected,
    ...other
  } = useConnect();

  const [actor] = useCanister('nft');

  const origynNftActor: OrigynNftActor = actor as any;

  let principal = Principal.anonymous();
  if (principalId) {
    principal = Principal.fromText(principalId);
  }

  return {
    ...other,
    activeWalletProvider,
    actor: origynNftActor,
    handleLogOut,
    isLoading: isInitializing,
    loggedIn: isConnected,
    principal,
    principalId: principal.isAnonymous() ? '' : principalId ?? '',
  };
};

const StyledPlugNotification = styled.div`
  position: absolute;
  top: 50px;
  right: 50px;
  border-width: 4px;
  border-style: solid;
  padding: 16px;
  box-sizing: border-box;
  max-width: calc(100% - 100px);
  border-image: linear-gradient(
      96.38deg,
      rgb(255, 231, 1) -0.67%,
      rgb(250, 81, 211) 31.53%,
      rgb(16, 217, 237) 61.61%,
      rgb(95, 255, 96) 100.67%
    )
    1;
  @media (max-width: 767px) {
    top: 80px;
    right: 8px;
    max-width: calc(100% - 16px);
  }
`;

const PlugNotification = () => {
  return (
    <StyledPlugNotification>
      <p>
        If you are using Plug wallet,
        <br /> <b>make sure you have logged-in to your Plug wallet extension.</b>
      </p>
    </StyledPlugNotification>
  );
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  return (
    <>
      <ConnectDialog />
      {auth.isLoading ? (
        <>
          <Preloader width="100%" />
          {window?.ic?.plug?.sessionManager?.initialized ? <PlugNotification /> : ''}
        </>
      ) : (
        <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
      )}
    </>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.object,
};
