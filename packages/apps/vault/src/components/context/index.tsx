import React, { createContext, useContext, useReducer } from 'react';
import { VaultState, VaultAction } from './types';

type Dispatch = (action: VaultAction) => void;

type VaultProviderProps = { children: React.ReactNode };

const VaultContext = createContext<{ state: VaultState; dispatch: Dispatch } | undefined>(
  undefined,
);

const reducer = (state: VaultState, action: VaultAction): VaultState => {
  switch (action.type) {
    case 'ownedItems':
      return { ...state, ownedItems: action.payload };
    case 'collectionPreview':
      return { ...state, collectionPreview: action.payload };
    case 'originatorPrincipal':
      return { ...state, originatorPrincipal: action.payload };
    case 'collectionData':
      return { ...state, collectionData: action.payload };
    case 'odcData':
      return { ...state, odcData: action.payload };
    case 'filter':
      return { ...state, filter: action.payload };
    case 'sort':
      return { ...state, sort: action.payload };
    case 'filteredOdcData':
      return { ...state, filteredOdcData: action.payload };
    case 'escrows':
      return { ...state, escrows: action.payload };
    case 'offers':
      return { ...state, offers: action.payload };
  }
};

const VaultProvider = ({ children }: VaultProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ownedItems: 0,
    collectionPreview: '',
    originatorPrincipal: '',
    collectionData: {},
    odcData: [],
    filter: '',
    sort: '',
    filteredOdcData: [],
    escrows: [],
    offers: [],
  });

  return <VaultContext.Provider value={{ state, dispatch }}>{children}</VaultContext.Provider>;
};

const useVault = () => {
  const context = useContext(VaultContext);
  if (context) {
    return context;
  }
  throw new Error('useVault must be used within a VaultProvider');
};

export { VaultProvider, useVault };
