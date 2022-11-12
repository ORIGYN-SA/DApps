import React from 'react';
import { ConnectDialog, useCanister, useConnect } from '@connect2ic/react';
import { Preloader } from '@dapp/features-components';
import { Principal } from '@dfinity/principal';
import { createContext, useContext } from 'react';
import { AuthContextType } from '../types';
import { useSessionContext } from './SessionProvider';

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  isLoading: false,
});

export const useAuthContext = () => useContext(AuthContext);

export const useAuth = () => {
  const { localDevelopment, canisterId } = useSessionContext();

  const {
    activeProvider: activeWalletProvider,
    principal,
    disconnect: handleLogOut,
    isInitializing,
    isConnected,
  } = useConnect();

  const [actor] = useCanister('nft');

  return {
    activeWalletProvider,
    actor,
    canisterId,
    handleLogOut,
    isLoading: isInitializing,
    localDevelopment,
    loggedIn: isConnected,
    principal: principal?.length > 0 ? Principal.fromText(principal) : Principal.anonymous(),
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  return (
    <>
      <ConnectDialog />
      {auth.isLoading ? (
        <Preloader />
      ) : (
        <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
      )}
    </>
  );
};
