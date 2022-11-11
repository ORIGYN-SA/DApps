import { Connect2ICContext, ConnectDialog, useCanister, useConnect } from '@connect2ic/react';
import { Preloader } from '@dapp/features-components';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from '../types';
import { origynNftIdl } from '@dapp/common-candid';
import { isLocal } from '@dapp/utils';
import { useSessionContext } from './SessionProvider';

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  isLoading: false,
});

export const useAuthContext = () => useContext(AuthContext);

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>();

  const { localDevelopment, canisterId } = useSessionContext();

  const { principal, disconnect: handleLogOut } = useConnect();

  const [actor] = useCanister('nft');
  const [ogyActor] = useCanister('ledger');

  // const getAnonIdentity = async () => {
  //   console.log('creating anonymous');
  //   const agent = new HttpAgent({
  //     host: localDevelopment && isLocal ? 'htpp://localhost:8000' : 'https://boundary.ic0.app/',
  //   });

  //   const nftActor = Actor.createActor(origynNftIdl, {
  //     agent,
  //     canisterId,
  //   });
  //   return nftActor;
  // };

  useEffect(() => {
    if (principal && principal !== '2vxsx-fae') {
      // setActor(client?.actors?.nft?.value || client?.anonymousActors?.nft.value);
      // refreshAllBalances(isLocal() && localDevelopment, Principal.fromText(principal));
      setLoggedIn(true);
      setIsLoading(false);
      localStorage.setItem('loggedIn', 'true');
    } else {
      if (loggedIn) {
        if (!principal || principal === '2vxsx-fae') {
          setLoggedIn(false);
          setIsLoading(false);
          localStorage.setItem('loggedIn', 'false');
        }
      } else {
        setIsLoading(false);
        setLoggedIn(false);
        localStorage.setItem('loggedIn', 'false');
      }
    }
  }, [principal]);

  return {
    actor,
    canisterId,
    handleLogOut,
    isAuthorized,
    isLoading,
    localDevelopment,
    loggedIn,
    ogyActor,
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
