import React, { createContext, useContext, useReducer } from 'react';
import type { VaultState, VaultAction } from './types';

type Dispatch = (action: VaultAction) => void;

type VaultProviderProps = { children: React.ReactNode };

const VaultContext = createContext<{ state: VaultState; dispatch: Dispatch } | undefined>(
  undefined,
);

const reducer = (state: VaultState, action: VaultAction): VaultState => {
  switch (action.type) {
    case 'ownedItems':
      return { ...state, ownedItems: action.payload };
    case 'collectionData':
      return { ...state, collectionData: action.payload };
    case 'odcs':
      return { ...state, odcs: action.payload };
    case 'filter':
      return { ...state, filter: action.payload };
    case 'sort':
      return { ...state, sort: action.payload };
    case 'filteredOdcs':
      return { ...state, filteredOdcs: action.payload };
  }
};

const VaultProvider = ({ children }: VaultProviderProps) => {
  const defaultVaultState: VaultState = {
    ownedItems: 0,
    collectionData: undefined,
    odcs: [],
    filteredOdcs: [],
    filter: '',
    sort: '',
  };

  const [state, dispatch] = useReducer(reducer, defaultVaultState);

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
