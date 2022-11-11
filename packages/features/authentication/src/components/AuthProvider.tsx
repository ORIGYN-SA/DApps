import { Connect2ICContext, ConnectDialog, useConnect } from '@connect2ic/react';
import { Preloader } from '@dapp/features-components';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from '../types';
import { origynNftIdl } from '@dapp/common-candid';
import { useTokensContext } from '../../../tokens-provider/src/TokensContextProvider';
import { isLocal } from '@dapp/utils';
import { useSessionContext } from './SessionProvider';

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  isLoading: false,
});

export const useAuthContext = () => useContext(AuthContext);

export const useAuth = (client: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>();
  // const [principal, setPrincipal] = useState<Principal | undefined>();
  // const [walletType, setWalletType] = useState<string | undefined>();
  // const [walletAccounts, setWalletAccounts] = useState<any>();
  // const [loggedWallet, setLoggedWallet] = useState<any>();
  const [actor, setActor] = useState<any>();
  const [ogyActor, setOgyActor] = useState<any>();
  // const [currentWalletAccount, setCurrentWalletAccount] = useState<any>();

  //const { refreshAllBalances } = useTokensContext();

  const { localDevelopment, canisterId } = useSessionContext();

  const { principal, disconnect: handleLogOut } = useConnect();

  const getAnonIdentity = async () => {
    console.log('creating anonymous');
    const agent = new HttpAgent({
      host: localDevelopment && isLocal ? 'htpp://localhost:8000' : 'https://boundary.ic0.app/',
    });

    const nftActor = Actor.createActor(origynNftIdl, {
      agent,
      canisterId,
    });
    return nftActor;
  };

  useEffect(() => {
    if (principal && principal !== '2vxsx-fae') {
      setActor(client?.actors?.nft?.value || client?.anonymousActors?.nft.value);
      // refreshAllBalances(isLocal() && localDevelopment, Principal.fromText(principal));
      setLoggedIn(true);
      setIsLoading(false);
      localStorage.setItem('loggedIn', 'true');
    } else {
      if (loggedIn) {
        if (!principal || principal === '2vxsx-fae')
          getAnonIdentity().then((nftActor) => {
            setActor(nftActor);
            setLoggedIn(false);
            setIsLoading(false);
            localStorage.setItem('loggedIn', 'false');
          });
      } else {
        console.log('useAuth > not loggedIn');
        getAnonIdentity().then((nftActor) => {
          setActor(nftActor);
          setIsLoading(false);
          setLoggedIn(false);
          localStorage.setItem('loggedIn', 'false');
        });
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
  const { client } = useContext(Connect2ICContext);
  const auth = useAuth(client);

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
