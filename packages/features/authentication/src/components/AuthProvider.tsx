import React from 'react';
import { ConnectDialog, useCanister, useConnect } from '@connect2ic/react';
import { Preloader } from '@dapp/features-components';
import { Principal } from '@dfinity/principal';
import { createContext, useContext } from 'react';
import { AuthContextType } from '../types';

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
    connect,
    isIdle,
    status
  } = useConnect();

  console.log(status, isIdle);
  const [actor] = useCanister('nft');

  return {
    activeWalletProvider,
    actor,
    handleLogOut,
    isLoading: isInitializing,
    loggedIn: isConnected,
    principal: principal?.length > 0 ? Principal.fromText(principal) : Principal.anonymous(),
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  console.log(auth);
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
