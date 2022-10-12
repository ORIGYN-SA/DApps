import React, { useState, useEffect, createContext, useContext } from 'react';
import { Principal } from '@dfinity/principal';
import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { origynNftIdl } from '@dapp/common-candid';
import { toast } from 'react-toastify';
import { Preloader } from '@dapp/features-components';
import { AuthClient } from '@dfinity/auth-client';
import { OrigynClient } from '@origyn-sa/mintjs';
import usePlug from './plug';
import useStoic from './stoic';
import useInternetIdentity from './internedIdentity';
import { getCanisterId, getTokenId } from './getRoute';

interface authContextType {
  isLoading: boolean;
  loggedIn: boolean;
  logIn: (wallet: string) => Promise<void>;
  isAuthorized?: boolean;
  tokenId?: string;
  canisterId?: string;
  principal?: Principal;
  actor?: any;
  ogyActor?: any;
  logOut: () => void;
  walletType?: string;
  loggedWallet?: string;
  accounts?: Array<any>;
  account?: any;
}

export const AuthContext = createContext<authContextType>({
  loggedIn: false,
  isLoading: false,
  loggedWallet: '',
  logIn: async () => {},
  logOut: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const useAuth = () => {
  const loggedInStatus = localStorage.getItem('loggedIn');
  const [isLoading, setIsLoading] = useState(!!(loggedInStatus && loggedInStatus !== 'false'));
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>();
  const [principal, setPrincipal] = useState<Principal | undefined>();
  const [walletType, setWalletType] = useState<string | undefined>();
  const [canisterId, setCanisterId] = useState<string | undefined>();
  const [tokenId, setTokenId] = useState<string | undefined>();
  const [walletAccounts, setWalletAccounts] = useState<any>();
  const [loggedWallet, setLoggedWallet] = useState<any>();
  const [actor, setActor] = useState<any>();
  const [ogyActor, setOgyActor] = useState<any>();
  const [currentWalletAccount, setCurrentWalletAccount] = useState<any>();
  const [useMainnet, setUseMainnet] = useState(true);

  const connectPlug = usePlug();
  const connectStoic = useStoic();
  const connectInternetIdentity = useInternetIdentity();

  const initOrigynClient = (canisterId: string, actor: ActorSubclass<any>) =>
    OrigynClient.getInstance().init(useMainnet, canisterId, actor);

  const logIn = async (wallet?: string) => {
    try {
      setIsLoading(true);
      const resolvedWallet = wallet || localStorage.getItem('loggedIn');
      setWalletType(resolvedWallet || undefined);
      switch (resolvedWallet) {
        case 'ii': {
          const ii = await connectInternetIdentity();
          if (ii.authorized) {
            setPrincipal(ii.principal);
            setActor(ii.actor);
            setTokenId(getTokenId());
            setIsAuthorized(true);
            setLoggedIn(true);
            setLoggedWallet('ii');
          } else {
            setIsAuthorized(false);
          }
          break;
        }
        case 'plug': {
          const p = await connectPlug();
          setPrincipal(p.principal);
          setActor(p.actor);
          setOgyActor(p.ogyActor);
          setTokenId(p.tokenId);
          setLoggedIn(true);
          setLoggedWallet('plug');
          break;
        }
        case 'stoic': {
          const s = await connectStoic();
          setPrincipal(s.principal);
          setWalletAccounts(s.accounts);
          // TODO: add account selection to local storage
          setCurrentWalletAccount(s.accounts[0]);
          setLoggedIn(true);
          setLoggedWallet('stoic');
          break;
        }
        default:
          logOut();
          console.error('Error: No wallet defined for log in function');
          break;
      }
      setIsLoading(false);
    } catch (e) {
      console.log('err', e);
      toast.error(`Cannot authorize. Try again.${e}`);
      logOut();
    }
  };
  const logOut = () => {
    localStorage.setItem('loggedIn', 'false');
    if (walletType === 'ii') {
      AuthClient.create().then((authClient) => {
        authClient.logout();
      });
    }
    setIsAuthorized(undefined);
    setLoggedIn(false);
    setIsLoading(false);
    setWalletAccounts(undefined);
    setCurrentWalletAccount(undefined);
  };

  const getAnonIdentity = async () => {
    const canisterId = await getCanisterId();

    const agent = new HttpAgent({
      host: 'https://boundary.ic0.app/',
    });

    const actor = Actor.createActor(origynNftIdl, {
      agent,
      canisterId: canisterId || '',
    });
    return actor;
  };

  useEffect(() => {
    if (loggedInStatus && loggedInStatus !== 'false') {
      logIn(loggedInStatus);
    } else {
      getAnonIdentity().then((a) => {
        const tid = getTokenId();
        setTokenId(tid);
        setActor(a);
      });
    }
  }, [localStorage.getItem('loggedIn')]);

  useEffect(() => {
    if (!canisterId) {
      getCanisterId().then((id) => setCanisterId(id));
    }
  }, []);

  useEffect(() => {
    const ids = window.location.pathname.split('/');
    const canisterPath = localStorage.getItem('canisterPath');
    const newCanisterPath = ids[2];
    if (canisterPath !== newCanisterPath) {
      localStorage.setItem('canisterPath', newCanisterPath);
      getCanisterId().then((id) => setCanisterId(id));
    }
  }, [window.location.pathname]);

  useEffect(() => {
    initOrigynClient(canisterId, actor);
  }, [canisterId, actor]);

  return {
    isLoading,
    loggedIn,
    tokenId,
    canisterId,
    loggedWallet,
    actor,
    ogyActor,
    logIn,
    isAuthorized,
    principal,
    logOut,
    walletType,
    accounts: walletAccounts,
    account: currentWalletAccount,
    useMainnet,
    setUseMainnet,
  };
};

export const AuthProvider: React.FC = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {auth.isLoading ? <Preloader /> : children}
    </AuthContext.Provider>
  );
};

export * from './createWalletActor';
export * from './getRoute';
