import React, { useState, useEffect, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent } from '@dfinity/agent';
import { phonebookIdl } from '@dapp/common-candid';

export interface RouteContextType {
  setRoute: (Obj?: RouteValues) => void;
  CanisterId: string;
  TokenId: string;
}

export interface RouteValues {
  CanisterId?: string;
  TokenId?: string;
}

export const RouteContext = createContext<RouteContextType>({
  setRoute: (Obj: RouteValues) => {
    Obj.CanisterId = '';
    Obj.TokenId = '';
  },
  CanisterId: '',
  TokenId: '',
});

export const useRouteContext = () => useContext(RouteContext);

export const useRoutee = () => {
  const [CanisterId, setCanisterId] = useState<string>(null);
  const [TokenId, setTokenId] = useState<string>(null);
  const location = useLocation();

  const setRoute = async (Obj?: RouteValues) => {
    const ids = window.location.pathname.split('/');
    const RouteVals = Obj || {};

    let CanisterId = '';
    let TokenId = null;

    if (ids.includes('collection')) {
      TokenId = '';
    }
    if (RouteVals.TokenId) {
      TokenId = RouteVals.TokenId;
    }
    if (RouteVals.CanisterId) {
      CanisterId = RouteVals.CanisterId;
    }

    try {
      const subdomain = window.location.hostname.split('.')[0];
      Principal.fromText(subdomain);
      if (TokenId === null) TokenId = ids[2];
      return { canisterId: subdomain, TokenId };
    } catch (e) {
      if (TokenId === null) TokenId = ids[4];
      if (CanisterId === '') {
        try {
          Principal.fromText(ids[2]);
          CanisterId = ids[2];
        } catch (e) {
          const agent = new HttpAgent({
            host: 'https://boundary.ic0.app/',
          });
          const actor = Actor.createActor(phonebookIdl, {
            agent: agent,
            canisterId: 'ngrpb-5qaaa-aaaaj-adz7a-cai',
          });
          // @ts-ignore
          canisterId = (await actor.lookup(ids[2])).toString();
        }
      }
    }
    setCanisterId(CanisterId);
    setTokenId(TokenId);
  };

  useEffect(() => {
    setRoute();
  }, [location]);
    
  return {
    setRoute,
    CanisterId,
    TokenId,
  };
};


export const RouteProvider = ({ children }) => {
  const Route = useRoutee();
  return <RouteContext.Provider value={Route}>{children}</RouteContext.Provider>;
};

export const useRoute = async () => {
  const ids = window.location.pathname.split('/');
  let canisterId = '';
  let tokenId = null;

  if (ids.includes('collection')) {
    tokenId = '';
  }
  try {
    const subdomain = window.location.hostname.split('.')[0];
    Principal.fromText(subdomain);
    if (tokenId === null) tokenId = ids[2];
    return { canisterId: subdomain, tokenId };
  } catch (e) {
    if (tokenId === null) tokenId = ids[4];
    try {
      Principal.fromText(ids[2]);
      canisterId = ids[2];
    } catch (e) {
      const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/',
      });
      const actor = Actor.createActor(phonebookIdl, {
        agent: agent,
        canisterId: 'ngrpb-5qaaa-aaaaj-adz7a-cai',
      });
      // @ts-ignore
      canisterId = (await actor.lookup(ids[2])).toString();
    }
  }
  return { canisterId, tokenId };
};
