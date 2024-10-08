// src/utils/priceUtils.ts

import { SaleDetails } from '../types/global';

export const EXCHANGE_RATE_API_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd';

/**
 * Fetches the current exchange rate from ICP to USD.
 * @returns {Promise<number>} The exchange rate.
 */
export const fetchExchangeRate = async (): Promise<number> => {
  const response = await fetch(EXCHANGE_RATE_API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch exchange rate');
  }
  const data = await response.json();
  return data['internet-computer'].usd;
};

/**
 * Converts a token amount from its smallest unit based on decimals.
 * @param {string} amount - The raw token amount as a string.
 * @param {string} decimals - The number of decimal places.
 * @returns {number} - The converted token amount.
 */
export const convertTokenAmount = (amount: string, decimals: string): number => {
  const decimal = parseInt(decimals, 10);
  return parseFloat(amount) / Math.pow(10, decimal);
};

/**
 * Converts ICP amount to USD.
 * @param {number} icpAmount - The amount in ICP.
 * @param {number} exchangeRate - The current ICP to USD exchange rate.
 * @returns {number} - The equivalent amount in USD.
 */
export const convertICPToUSD = (icpAmount: number, exchangeRate: number): number => {
  return icpAmount * exchangeRate;
};

export const extractSaleDetails = (
  saleData: any,
  exchangeRates: Record<string, number>,
): SaleDetails | null => {
  if (!saleData) {
    return null;
  }

  const currency = saleData.currency || 'Unknown';

  // Helper function to calculate USD equivalent
  const calculateAmountUSD = (amount: number): number | null => {
    return exchangeRates[currency]
      ? parseFloat((amount * exchangeRates[currency]).toFixed(2))
      : null;
  };

  const buyNow = {
    amount: saleData.buy_now?.amount || 0,
    amountUSD: calculateAmountUSD(saleData.buy_now?.amount || 0),
  };

  const currentBid = {
    amount: saleData.current_bid?.amount || 0,
    amountUSD: calculateAmountUSD(saleData.current_bid?.amount || 0),
  };

  const startPrice = {
    amount: saleData.start_price?.amount || 0,
    amountUSD: calculateAmountUSD(saleData.start_price?.amount || 0),
  };

  return {
    currentBid,
    buyNow,
    startPrice,
    currency,
    saleId: saleData.saleId || null,
    startDate: saleData.startDate || null,
    endDate: saleData.endDate || null,
    winner: saleData.winner || [],
    participants: saleData.participants || [],
  };
};
