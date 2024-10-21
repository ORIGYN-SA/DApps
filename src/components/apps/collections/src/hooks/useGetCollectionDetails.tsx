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
import { fetchCategoryByPrincipalId } from '../utils/categoryUtils.js'

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
      throw new Error(
        `Error retrieving collection: ${collectionResult.err?.text || 'Unknown error'}`,
      )
    }

    const collectionInfo = collectionResult.ok
    const categoryName = await fetchCategoryByPrincipalId(canisterId)

    if (!collectionInfo.token_ids || collectionInfo.token_ids.length === 0) {
      return {
        name: [],
        canister_id: canisterId,
        categoryName,
        logo: [],
        nfts: [],
      }
    }

    const tokenIds: string[] = collectionInfo.token_ids[0]

    const nftResults = await Promise.all(tokenIds.map(tokenId => actor.nft_batch_origyn([tokenId])))
    console.log('nftResults', nftResults)
    const nfts: NFT[] = nftResults
      .filter((nftResult: any) => {
        if ('ok' in nftResult[0]) {
          const sales = nftResult[0].ok.current_sale || []
          const openSales = sales.filter((sale: any) => {
            return (
              sale.sale_type &&
              sale.sale_type.auction &&
              !('closed' in sale.sale_type.auction.status)
            )
          })
          return openSales.length > 0
        }
        return false
      })
      .map((nftResult, index) => {
        if ('ok' in nftResult[0]) {
          const { tokenName, imageUrl } = extractMetadata(nftResult[0].ok.metadata, canisterId)

          const sales = nftResult[0].ok.current_sale || []
          const openSales = sales.filter((sale: any) => {
            return (
              sale.sale_type &&
              sale.sale_type.auction &&
              !('closed' in sale.sale_type.auction.status)
            )
          })

          console.log('openSales', openSales)

          const saleDetails: SaleDetails | null =
            openSales.length > 0 ? extractSaleDetails(openSales[0], tokenPrices) : null

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
            id: tokenName,
            name: tokenName,
            collectionName: canisterId,
            categoryName,
            image: imageUrl,
            logo: getLogo(currency),
            price,
            currency,
            priceUSD,
            saleDetails: saleDetails || undefined,
          } as NFT
        } else if ('err' in nftResult[0]) {
          console.error(`Error for token ${tokenIds[index]}: ${nftResult[0].err.text}`)
          return undefined
        }
      })
      .filter((nft): nft is NFT => nft !== undefined)

    return {
      name: collectionInfo.name || [],
      logo: collectionInfo.logo || [],
      categoryName,
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
  })
}
