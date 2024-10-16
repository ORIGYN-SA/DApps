// src/utils/priceUtils.ts

import { SaleDetails } from '../types/global'

export const EXCHANGE_RATE_API_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd'

/**
 * Fetches the current exchange rate from ICP to USD.
 * @returns {Promise<number>} The exchange rate.
 */
export const fetchExchangeRate = async (): Promise<number> => {
  const response = await fetch(EXCHANGE_RATE_API_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch exchange rate')
  }
  const data = await response.json()
  return data['internet-computer'].usd
}

export const convertTokenAmount = (amount: string, decimals: string | number): number => {
  const decimal = typeof decimals === 'string' ? parseInt(decimals, 10) : decimals
  return parseFloat(amount) / Math.pow(10, decimal)
}
/**
 * Converts ICP amount to USD.
 * @param {number} icpAmount - The amount in ICP.
 * @param {number} exchangeRate - The current ICP to USD exchange rate.
 * @returns {number} - The equivalent amount in USD.
 */
export const convertICPToUSD = (icpAmount: number, exchangeRate: number): number => {
  return icpAmount * exchangeRate
}

export const extractSaleDetails = (
  saleData: any,
  tokenPrices: Record<string, number>,
): SaleDetails | null => {
  if (!saleData || !saleData.sale_type || !saleData.sale_type.auction) {
    return null
  }

  const auction = saleData.sale_type.auction
  const currency = auction.token?.ic?.symbol || 'Unknown'
  const decimals = auction.token?.ic?.decimals ? Number(auction.token.ic.decimals) : 0

  const calculateAmountUSD = (amount: string | number): number | null => {
    const scaledAmount = convertTokenAmount(amount.toString(), decimals)
    return tokenPrices[currency]
      ? parseFloat((scaledAmount * tokenPrices[currency]).toFixed(2))
      : null
  }

  const currentBidAmount = auction.current_bid_amount || '0'
  const buyNowAmount =
    auction.config?.auction?.buy_now?.[0] ||
    auction.config?.ask?.[0]?.find((feature: any) => 'buy_now' in feature)?.buy_now ||
    '0'
  const startPriceAmount = auction.config?.auction?.start_price || '0'

  const currentBid = {
    amount: convertTokenAmount(currentBidAmount, decimals),
    amountUSD: calculateAmountUSD(currentBidAmount),
  }

  const buyNow = {
    amount: convertTokenAmount(buyNowAmount, decimals),
    amountUSD: calculateAmountUSD(buyNowAmount),
  }

  const startPrice = {
    amount: convertTokenAmount(startPriceAmount, decimals),
    amountUSD: calculateAmountUSD(startPriceAmount),
  }

  return {
    currentBid,
    buyNow,
    startPrice,
    currency,
    saleId: saleData.sale_id || null,
    startDate: auction.config?.auction?.start_date || null,
    endDate: auction.config?.auction?.ending?.date || null,
    winner: auction.winner || [],
    participants: auction.participants || [],
  }
}
