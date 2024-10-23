// src/hooks/useGetNFTDetails.ts

import { useQuery } from '@tanstack/react-query'
import { Actor, HttpAgent } from '@dfinity/agent'
import { idlFactory as goldIdlFactory } from '../canisters/gld_nft/did.js'
import { _SERVICE as _GOLD_NFT_SERVICE } from '../canisters/gld_nft/interfaces/gld_nft.js'
import { NFT, SaleDetails } from '../types/global'
import { extractSaleDetails } from '../utils/priceUtils'
import { useTokenData } from '../context/TokenDataContext'
import { extractMetadata, extractOwner } from '../utils/metadataUtils.js'

/**
 * Fetches NFT details, using the exchange rate from the CurrencyPriceContext.
 */
const fetchNFTDetails = async (
  canisterId: string,
  nftId: string,
  tokenUSDPrices: Record<string, number>,
): Promise<NFT> => {
  try {
    const agent = new HttpAgent({ host: 'https://ic0.app' })
    const actor = Actor.createActor<_GOLD_NFT_SERVICE>(goldIdlFactory, {
      agent,
      canisterId,
    })

    const collectionResult = await actor.collection_nft_origyn([])

    let collectionName = 'Unknown'
    if ('ok' in collectionResult && Array.isArray(collectionResult.ok.name)) {
      collectionName = collectionResult.ok.name[0] || 'Unknown'
    }

    const nftResult = await actor.nft_batch_origyn([nftId])
    console.log('nftResult', nftResult)

    const nft: NFT[] = nftResult
      .map(nftResultItem => {
        if ('ok' in nftResultItem) {
          const { tokenName, imageUrl } = extractMetadata(nftResultItem.ok.metadata, canisterId)

          const owner = extractOwner(nftResultItem)

          const saleData = nftResultItem.ok.current_sale ? nftResultItem.ok.current_sale[0] : null
          const saleDetails: SaleDetails | null = extractSaleDetails(saleData, tokenUSDPrices)

          let price = 0
          let priceUSD = 0
          let currency = ''

          if (saleDetails) {
            price = saleDetails.buyNow.amount ?? 0
            currency = saleDetails.currency
            priceUSD = saleDetails.buyNow.amountUSD ?? 0
          }

          return {
            id: nftId,
            name: tokenName,
            collectionName,
            image: imageUrl,
            price,
            currency,
            priceUSD,
            saleDetails: saleDetails || undefined,
            owner,
          } as NFT
        }
      })
      .filter((nft): nft is NFT => nft !== undefined)

    return nft[0]
  } catch (error) {
    console.error('Error in fetchNFTDetails:', error)
    throw error
  }
}

/**
 * Custom hook to get NFT details using React Query and exchange rate from the context.
 */
export const useGetNFTDetails = (canisterId: string, nftId: string) => {
  const { tokens, isLoading: isPricesLoading, isError: isPricesError } = useTokenData()

  const tokenUSDPrices: Record<string, number> = tokens.reduce((acc, token) => {
    acc[token.symbol] = token.priceUSD
    return acc
  }, {} as Record<string, number>)

  return useQuery<NFT, Error, NFT, [string, string, string]>({
    queryKey: ['collectionDetail', canisterId, nftId],
    queryFn: () => fetchNFTDetails(canisterId, nftId, tokenUSDPrices),
    enabled: !!canisterId && !!nftId && !isPricesLoading && !isPricesError,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
