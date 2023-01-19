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
    case 'collectionPreview':
      return { ...state, collectionPreview: action.payload };
    case 'collectionData':
      return { ...state, collectionData: action.payload };
    case 'odcData':
      return { ...state, odcData: action.payload };
    case 'filteredOdcData':
      return { ...state, filteredOdcData: action.payload };
  }
};

const MarketplaceProvider = ({ children }: MarketplaceProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    totalItems: 0,
    collectionPreview: '',
    collectionData: {},
    odcData: [],
    filteredOdcData: [],
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
