import React, { createContext, useContext, useReducer } from 'react';
import { MarketplaceState, MarketplaceAction } from './types';

type Dispatch = (action: MarketplaceAction) => void;

type MarketplaceProviderProps = { children: React.ReactNode };

const MarketplaceContext = createContext<
  { state: MarketplaceState; dispatch: Dispatch } | undefined
>(undefined);

const reducer = (state: MarketplaceState, action: MarketplaceAction): MarketplaceState => {
  switch (action.type) {
    case 'totalItems':
      return { ...state, totalItems: action.payload };
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

const MarketplaceProvider = ({ children }: MarketplaceProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    totalItems: 0,
    collectionData: undefined,
    odcs: [],
    filter: '',
    sort: '',
    filteredOdcs: [],
  });

  return (
    <MarketplaceContext.Provider value={{ state, dispatch }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (context) {
    return context;
  }
  throw new Error('useMarketplace must be used within a MarketplaceProvider');
};

export { MarketplaceProvider, useMarketplace };
