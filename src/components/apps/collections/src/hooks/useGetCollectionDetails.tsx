// src/hooks/useGetCollectionDetails.ts

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Actor, HttpAgent } from '@dfinity/agent'
import { idlFactory as goldIdlFactory } from '../canisters/gld_nft/did.js'
import {
  _SERVICE as _GOLD_NFT_SERVICE,
  CandyShared,
} from '../canisters/gld_nft/interfaces/gld_nft.js'
import { CollectionWithNFTs, NFT, SaleDetails } from '../types/global.js'
import { extractSaleDetails } from '../utils/priceUtils'
import { useTokenData } from '../context/TokenDataContext'
import { extractMetadata } from '../utils/metadataUtils.js'

const fetchCollectionDetail = async (
  canisterId: string,
  tokenPrices: Record<string, number>,
  getLogo: (symbol: string) => string | undefined,
): Promise<CollectionWithNFTs> => {
  try {
    const agent = new HttpAgent({ host: 'https://ic0.app' })
    const actor = Actor.createActor<_GOLD_NFT_SERVICE>(goldIdlFactory, {
      agent,
      canisterId,
    })

    const collectionResult = await actor.collection_nft_origyn([])
    if (!('ok' in collectionResult)) {
      throw new Error(`Error retrieving collection: ${collectionResult.err.text}`)
    }

    const collectionInfo = collectionResult.ok

    if (
      !collectionInfo.token_ids ||
      collectionInfo.token_ids.length === 0 ||
      !collectionInfo.token_ids[0]
    ) {
      return {
        name: [],
        canister_id: canisterId,
        logo: [],
        nfts: [],
      }
    }

    const tokenIds: string[] = collectionInfo.token_ids[0]
    const nftResults = await actor.nft_batch_origyn(tokenIds)

    const nfts: NFT[] = nftResults
      .map((nftResult, index) => {
        if ('ok' in nftResult) {
          const { tokenName, imageUrl } = extractMetadata(nftResult.ok.metadata, canisterId)

          const saleData =
            nftResult.ok.current_sale && nftResult.ok.current_sale.length > 0
              ? nftResult.ok.current_sale[0]
              : null

          const saleDetails: SaleDetails | null = extractSaleDetails(saleData, tokenPrices)

          let price = 0
          let priceUSD = 0
          let currency = ''

          if (saleDetails) {
            price =
              saleDetails.currentBid.amount > 0
                ? saleDetails.currentBid.amount
                : saleDetails.buyNow.amount > 0
                ? saleDetails.buyNow.amount
                : saleDetails.startPrice.amount

            currency = saleDetails.currency
            priceUSD =
              saleDetails.currentBid.amountUSD ??
              saleDetails.buyNow.amountUSD ??
              saleDetails.startPrice.amountUSD ??
              0
          }

          return {
            id: tokenIds[index],
            name: tokenName,
            collectionName: canisterId,
            image: imageUrl,
            logo: getLogo(currency),
            price,
            currency,
            priceUSD,
            saleDetails: saleDetails || undefined,
          } as NFT
        } else {
          console.error(`Error for token ${tokenIds[index]}: ${nftResult.err.text}`)
          return undefined
        }
      })
      .filter((nft): nft is NFT => nft !== undefined)

    return {
      name: collectionInfo.name || [],
      logo: collectionInfo.logo || [],
      canister_id: canisterId,
      nfts,
    }
  } catch (error) {
    console.error('Error in fetchCollectionDetail:', error)
    throw error
  }
}

export const useGetCollectionDetails = (canisterId: string) => {
  const { tokens, getLogo, isLoading: isPricesLoading, isError: isPricesError } = useTokenData()

  const tokenUSDPrices: Record<string, number> = tokens.reduce((acc, token) => {
    acc[token.symbol] = token.priceUSD
    return acc
  }, {} as Record<string, number>)

  return useQuery<CollectionWithNFTs, Error>({
    queryKey: ['collectionDetail', canisterId],
    queryFn: () => fetchCollectionDetail(canisterId, tokenUSDPrices, getLogo),
    placeholderData: keepPreviousData,
    enabled: !!canisterId && !isPricesLoading && !isPricesError,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}