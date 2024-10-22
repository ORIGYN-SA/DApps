import React, { createContext, useCallback, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { icpswapStoreActor } from '../canisters/actor/ICSwapStore'
import { createTokenMetadataActor } from '../canisters/actor/TokenMetadata'
import { currencies, Currency } from '../constants/currencies'
import { _SERVICE as StoreService, PublicTokenOverview } from '../canisters/icpswap/store'

interface Token extends PublicTokenOverview {
  decimals: number
  isUsable: boolean
  logo?: string
}

interface TokenPriceContextProps {
  tokens: Token[]
  isLoading: boolean
  isError: boolean
  getUSDPrice: (symbol: string) => number
  getLogo: (symbol: string) => string | undefined
  getTokenData: (symbol: string) => Token | undefined
}

const isText = (value: any): value is { Text: string } => {
  return 'Text' in value
}

const fetchVerifiedTokens = async (): Promise<Token[]> => {
  const allTokens: PublicTokenOverview[] = await icpswapStoreActor.getAllTokens()

  const filteredTokens = allTokens.filter(token => token.volumeUSD7d >= 5000)

  const icpTokensResponse = await fetch('https://web2.icptokens.net/api/tokens')
  const icpTokens = await icpTokensResponse.json()

  const icpTokensMap = icpTokens.reduce((acc, token) => {
    acc[token.symbol] = token
    return acc
  }, {} as { [symbol: string]: any })

  const currenciesMap = currencies.reduce((acc, curr) => {
    acc[curr.code] = curr
    return acc
  }, {} as { [symbol: string]: Currency })

  const pLimit = await import('p-limit').then(module => module.default)
  const limit = pLimit(5)

  const tokensWithDetails = await Promise.all(
    filteredTokens.map(tokenOverview =>
      limit(async () => {
        const icpToken = icpTokensMap[tokenOverview.symbol]
        let decimals = 8 // Default value

        const currencyInfo = currenciesMap[tokenOverview.symbol]
        if (currencyInfo) {
          decimals = currencyInfo.decimals
        } else {
          if (icpToken && icpToken.canister_id === tokenOverview.address) {
            const tokenMetadataActor = createTokenMetadataActor(tokenOverview.address)

            try {
              const decimalsResult = await tokenMetadataActor.icrc1_decimals()
              if (typeof decimalsResult === 'number') {
                decimals = decimalsResult
              } else {
                console.warn(
                  `Unexpected decimalsResult for token ${tokenOverview.symbol}:`,
                  decimalsResult,
                )
              }
            } catch (error) {
              console.error(`Error fetching decimals for token ${tokenOverview.symbol}:`, error)
            }
          }
        }

        return {
          ...tokenOverview,
          decimals,
          isUsable: currencyInfo?.isUsable ?? false,
          logo: currencyInfo?.icon || icpToken?.logo || '',
        } as Token
      }),
    ),
  )

  return tokensWithDetails.filter(token => token !== null)
}

const useTokenPriceQuery = () => {
  return useQuery<Token[], Error>({
    queryKey: ['tokens'],
    queryFn: fetchVerifiedTokens,
    refetchInterval: 600000, // 10 minutes
    staleTime: 600000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

export const TokenDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isLoading, isError } = useTokenPriceQuery()
  const tokens: Token[] = data ?? []

  const getLogo = useCallback(
    (symbol: string): string | undefined => {
      const token = tokens.find(t => t.symbol === symbol)
      return token?.logo
    },
    [tokens],
  )

  const getTokenData = useCallback(
    (symbol: string): Token | undefined => {
      return tokens.find(t => t.symbol === symbol)
    },
    [tokens],
  )

  const getUSDPrice = useCallback(
    (symbol: string): number => {
      const token = getTokenData(symbol)
      return token?.priceUSD || 0
    },
    [getTokenData],
  )

  return (
    <TokenDataContext.Provider
      value={{ tokens, isLoading, isError, getUSDPrice, getLogo, getTokenData }}
    >
      {children}
    </TokenDataContext.Provider>
  )
}

export const useTokenData = (): TokenPriceContextProps => {
  const context = useContext(TokenDataContext)
  if (!context) {
    throw new Error('useTokenData must be used within a TokenDataProvider')
  }
  return context
}

export const TokenDataContext = createContext<TokenPriceContextProps | undefined>(undefined)
