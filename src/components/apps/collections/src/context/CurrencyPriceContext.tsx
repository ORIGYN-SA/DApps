import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { currencies } from '../constants/currencies';

interface CurrencyPrices {
  [key: string]: number;
}

interface CurrencyPriceContextProps {
  prices: CurrencyPrices;
  isLoading: boolean;
  isError: boolean;
}

const CurrencyPriceContext = createContext<CurrencyPriceContextProps | undefined>(undefined);

const currencyIds = currencies.map((curr) => curr.coingeckoId).join(',');

const fetchCurrencyPrices = async (): Promise<CurrencyPrices> => {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
    params: {
      ids: currencyIds,
      vs_currencies: 'usd',
    },
  });

  const data = response.data;

  const prices: CurrencyPrices = {};

  currencies.forEach((curr) => {
    const price = data[curr.coingeckoId]?.usd ?? 0;
    prices[curr.code] = price;
  });

  return prices;
};

const useCurrencyPriceQuery = () => {
  return useQuery<CurrencyPrices, Error>({
    queryKey: ['currencyPrices'],
    queryFn: fetchCurrencyPrices,
    refetchInterval: 30000,
    staleTime: 30000,
  });
};

export const CurrencyPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isLoading, isError } = useCurrencyPriceQuery();

  const prices: CurrencyPrices = data ?? {};

  return (
    <CurrencyPriceContext.Provider value={{ prices, isLoading, isError }}>
      {children}
    </CurrencyPriceContext.Provider>
  );
};

export const useCurrencyPrice = (): CurrencyPriceContextProps => {
  const context = useContext(CurrencyPriceContext);
  if (!context) {
    throw new Error('useCurrencyPrice doit être utilisé à l’intérieur d’un CurrencyPriceProvider');
  }
  return context;
};
