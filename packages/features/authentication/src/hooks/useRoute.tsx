import React, { useState, useEffect, createContext, useContext } from 'react';
import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent } from '@dfinity/agent';
import { phonebookIdl } from '@dapp/common-candid';

export interface RouteContextType {
  setRoute : (Obj : RouteValues) => void;
}

export interface RouteValues {
  CanisterId? : string;
  TokenId?: string;
}

export const RouteContext = createContext<RouteContextType>({
  setRoute : (Obj : RouteValues) => {
    Obj.CanisterId = ''; 
    Obj.TokenId = '';},
});

export const useRouteContext = () => useContext(RouteContext);

export const useRoutee = () => {
  const [CanisterId, setCanisterId] = useState<string>();
  const [TokenId, setTokenId] = useState<string>();
 // IF CANISTER IS PRovided or token id is provided from user i return that . Imagine for example when I set token Id from nftbar 
  const setRoute = (
    Obj : RouteValues,
  ) => {
  const ids = window.location.pathname.split('/');
  if (ids.includes('collection')) {
    setTokenId('');
  }
  try {
    const subdomain = window.location.hostname.split('.')[0];
    Principal.fromText(subdomain);
    if (TokenId === null) {
    setTokenId(ids[2]);
    setCanisterId(subdomain)
    }
  } catch (e) {
    if (TokenId === null) setTokenId(ids[4]);
    try {
      Principal.fromText(ids[2]);
      setCanisterId(ids[2]);
    } catch (e) {
      const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/',
      });
      const actor = Actor.createActor(phonebookIdl, {
        agent: agent,
        canisterId: 'ngrpb-5qaaa-aaaaj-adz7a-cai',
      });
      // @ts-ignore
      const canisterId = (actor.lookup(ids[2])).toString();
      setCanisterId(canisterId);
    }
  }
  };
  return {
    setRoute,
    CanisterId,
    TokenId,
  }
}

export const RouteProvider = ({ children }) => {
  const Route = useRoutee();
  return (
    <RouteContext.Provider value={Route}>
      {children}
    </RouteContext.Provider>
  );
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
