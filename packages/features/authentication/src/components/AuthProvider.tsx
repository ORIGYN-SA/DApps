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

  // useEffect(() => {
  //   if (principal && principal !== '2vxsx-fae') {
  //     setLoggedIn(true);
  //     setIsLoading(false);
  //     localStorage.setItem('loggedIn', 'true');
  //   } else {
  //     if (loggedIn) {
  //       if (!principal || principal === '2vxsx-fae') {
  //         setLoggedIn(false);
  //         setIsLoading(false);
  //         localStorage.setItem('loggedIn', 'false');
  //       }
  //     } else {
  //       setIsLoading(false);
  //       setLoggedIn(false);
  //       localStorage.setItem('loggedIn', 'false');
  //     }
  //   }
  // }, [principal]);

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
