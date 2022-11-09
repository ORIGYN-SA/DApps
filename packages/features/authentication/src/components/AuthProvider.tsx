import { Connect2ICContext, ConnectDialog, useConnect } from '@connect2ic/react';
import { Preloader } from '@dapp/features-components';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from '../types';
import { origynNftIdl } from '@dapp/common-candid';
import { useTokensContext } from '../../../tokens-provider/src/TokensContextProvider';

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  isLoading: false,
});

export const useAuthContext = () => useContext(AuthContext);

export const useAuth = (client: any, canisterId: string, tokenId: string) => {
  const browserLoggedIn = localStorage.getItem('loggedIn');
  const [isLoading, setIsLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  console.log('🚀 ~ file: AuthProvider.tsx ~ line 21 ~ useAuth ~ loggedIn', loggedIn);
  const [isAuthorized, setIsAuthorized] = useState<boolean>();
  // const [principal, setPrincipal] = useState<Principal | undefined>();
  // const [walletType, setWalletType] = useState<string | undefined>();
  // const [walletAccounts, setWalletAccounts] = useState<any>();
  // const [loggedWallet, setLoggedWallet] = useState<any>();
  const [actor, setActor] = useState<any>();
  const [ogyActor, setOgyActor] = useState<any>();
  // const [currentWalletAccount, setCurrentWalletAccount] = useState<any>();

  const { refreshAllBalances } = useTokensContext();

  const {
    isConnected,
    isInitializing,
    principal,
    disconnect: handleLogOut,
  } = useConnect({
    onConnect: () => {
      console.log('useAuth > CONNECTED');
      setIsLoading(false);
      setLoggedIn(true);
      setIsAuthorized(true);
      setActor(client?.actors?.nft.value || client?.anonymousActors?.nft.value);
      setOgyActor(client?.actors?.ledger.value || client?.anonymousActors?.ledger.value);
      localStorage.setItem('loggedIn', 'true');
    },
    onDisconnect: () => {
      console.log('DISCONNECTED');
      setIsLoading(false);
      setLoggedIn(false);
      setIsAuthorized(false);
      setActor(client?.actors?.nft?.value || client?.anonymousActors?.nft?.value);
      setOgyActor(client?.actors?.ledger?.value || client?.anonymousActors?.ledger?.value);
      localStorage.setItem('loggedIn', 'false');
    },
  });
  console.log('🚀 ~ file: AuthProvider.tsx ~ line 53 ~ useAuth ~ principal', principal);

  const getAnonIdentity = async () => {
    const agent = new HttpAgent({
      host: 'https://boundary.ic0.app/',
    });

    const nftActor = Actor.createActor(origynNftIdl, {
      agent,
      canisterId,
    });
    return nftActor;
  };

  useEffect(() => {
    if (principal && principal !== '2vxsx-fae') refreshAllBalances(Principal.fromText(principal));

    if (!isInitializing) {
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
          localStorage.setItem('loggedIn', 'false');
        });
      }
    }
  }, [principal, isInitializing]);

  return {
    isLoading,
    loggedIn,
    tokenId,
    canisterId,
    actor,
    ogyActor,
    isAuthorized,
    principal: principal?.length > 0 ? Principal.fromText(principal) : Principal.anonymous(),
    handleLogOut,
  };
};

export const AuthProvider = ({ children, canisterId, tokenId }) => {
  const { client } = useContext(Connect2ICContext);
  const auth = useAuth(client, canisterId, tokenId);

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
