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

/**
 * Extracts and formats sale details from the raw NFT sale data.
 * @param {any} saleData - The raw sale data object.
 * @param {number} exchangeRate - The current ICP to USD exchange rate.
 * @returns {SaleDetails | null} - An object containing formatted sale details or null if not available.
 */
export const extractSaleDetails = (saleData: any, exchangeRate: number): SaleDetails | null => {
  if (!saleData || !saleData.sale_type || !saleData.sale_type.auction) {
    return null;
  }

  const auction = saleData.sale_type.auction;
  const token = auction.token.ic;
  const decimals = token.decimals;
  const symbol = token.symbol;

  // Current Bid Amount
  const rawCurrentBid = auction.current_bid_amount;
  const currentBidICP = convertTokenAmount(rawCurrentBid, decimals);
  const currentBidUSD = convertICPToUSD(currentBidICP, exchangeRate);

  // Buy Now Price
  const rawBuyNow = auction.config.auction.buy_now[0];
  const buyNowICP = convertTokenAmount(rawBuyNow, decimals);
  const buyNowUSD = convertICPToUSD(buyNowICP, exchangeRate);

  // Start Price
  const rawStartPrice = auction.config.auction.start_price;
  const startPriceICP = convertTokenAmount(rawStartPrice, decimals);
  const startPriceUSD = convertICPToUSD(startPriceICP, exchangeRate);

  // Extract winner
  const winner = auction.winner ? auction.winner.map((w: any) => w.principal) : [];

  // Extract participants
  const participants = auction.participants
    ? auction.participants.map((p: any) => ({
        principal: p[0],
        bidAmount: p[1],
      }))
    : [];

  return {
    currentBid: {
      amountICP: currentBidICP,
      amountUSD: currentBidUSD,
    },
    buyNow: {
      amountICP: buyNowICP,
      amountUSD: buyNowUSD,
    },
    startPrice: {
      amountICP: startPriceICP,
      amountUSD: startPriceUSD,
    },
    currency: symbol,
    saleId: saleData.sale_id || null,
    startDate: auction.start_date || null,
    endDate: auction.end_date || null,
    winner,
    participants,
  };
};
