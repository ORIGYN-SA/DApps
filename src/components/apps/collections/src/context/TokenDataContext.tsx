import React, { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { icpswapStoreActor } from '../canisters/actor/ICSwapStore'
import { createTokenMetadataActor } from '../canisters/actor/TokenMetadata'
import { currencies } from '../constants/currencies'
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
}

const isNat = (value: any): value is { Nat: number } => {
  return 'Nat' in value
}

const isText = (value: any): value is { Text: string } => {
  return 'Text' in value
}

const fetchVerifiedTokens = async (): Promise<Token[]> => {
  const allTokens: PublicTokenOverview[] = await icpswapStoreActor.getAllTokens()
  console.log('All Tokens:', allTokens)

  const filteredTokens = allTokens.filter(token => token.volumeUSD7d >= 1000)

  const icpTokensResponse = await fetch('https://web2.icptokens.net/api/tokens')
  const icpTokens = await icpTokensResponse.json()

  const icpTokensMap = icpTokens.reduce((acc, token) => {
    acc[token.symbol] = token
    return acc
  }, {} as { [symbol: string]: any })

  const currenciesMap = currencies.reduce((acc, curr) => {
    acc[curr.code] = curr.isUsable
    return acc
  }, {} as { [symbol: string]: boolean })

  const uniqueTokensMap: { [symbol: string]: Token } = {}

  filteredTokens.forEach(tokenOverview => {
    const icpToken = icpTokensMap[tokenOverview.symbol]

    if (icpToken) {
      if (icpToken.canister_id === tokenOverview.address) {
        uniqueTokensMap[tokenOverview.symbol] = {
          ...tokenOverview,
          decimals: icpToken.decimals || 8,
          isUsable: currenciesMap[tokenOverview.symbol] ?? false,
          priceUSD: tokenOverview.priceUSD,
        }
      }
    } else {
      uniqueTokensMap[tokenOverview.symbol] = {
        ...tokenOverview,
        decimals: 8,
        isUsable: currenciesMap[tokenOverview.symbol] ?? false,
        priceUSD: tokenOverview.priceUSD,
      }
    }
  })

  const tokensWithDetails = await Promise.all(
    Object.values(uniqueTokensMap).map(async tokenOverview => {
      const tokenMetadataActor = createTokenMetadataActor(tokenOverview.address)

      let logo = ''
      let decimals = tokenOverview.decimals

      try {
        const metadata = await tokenMetadataActor.icrc1_metadata()
        const logoEntry = metadata.find(entry => entry[0] === 'icrc1:logo')
        if (logoEntry && isText(logoEntry[1])) {
          logo = logoEntry[1].Text
        }

        const decimalsResult = await tokenMetadataActor.icrc1_decimals()
        decimals = decimalsResult[0]

        if (!logo && icpTokensMap[tokenOverview.symbol]) {
          const icpToken = icpTokensMap[tokenOverview.symbol]
          if (icpToken.logo) {
            logo = `https://web2.icptokens.net/storage/${icpToken.logo}`
          }
        }
      } catch (error) {
        console.error(`Error fetching metadata for ${tokenOverview.symbol}:`, error)
      }

      return {
        ...tokenOverview,
        decimals,
        logo,
      } as Token
    }),
  )

  const tokensWithPrices = tokensWithDetails.map(token => {
    return {
      ...token,
      priceUSD: token.priceUSD ?? 0,
    }
  })

  return tokensWithPrices.filter((token): token is Token => token !== null)
}

const useTokenPriceQuery = () => {
  return useQuery<Token[], Error>({
    queryKey: ['tokens'],
    queryFn: fetchVerifiedTokens,
    refetchInterval: 60000,
    staleTime: 60000,
  })
}

export const TokenDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isLoading, isError } = useTokenPriceQuery()
  const tokens: Token[] = data ?? []

  const getUSDPrice = (symbol: string): number => {
    const token = tokens.find(t => t.symbol === symbol)
    return token?.priceUSD ?? 0
  }

  const getLogo = (symbol: string): string | undefined => {
    const token = tokens.find(t => t.symbol === symbol)
    return token?.logo
  }

  return (
    <TokenDataContext.Provider value={{ tokens, isLoading, isError, getUSDPrice, getLogo }}>
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
