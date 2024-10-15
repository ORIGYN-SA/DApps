import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Actor, HttpAgent } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { useTokenData } from '../context/TokenDataContext'
import { NFT, SaleDetails } from '../types/global'
import { extractSaleDetails } from '../utils/priceUtils'
import { idlFactory as collection_idlFactory } from '../canisters/collections/collection_index.did.js'
import { _SERVICE as _COLLECTION_SERVICE } from '../canisters/collections/collection_index.did.js'
import { _SERVICE as _GOLD_SERVICE } from '../canisters/gld_nft/interfaces/gld_nft.js'
import { idlFactory as nft_idlFactory } from '../canisters/gld_nft/did.js'
import { extractMetadata } from '../utils/metadataUtils.js'
import { COLLECTIONS_INDEX_CANISTER_ID } from '../constants.js'

const fetchUserNFTs = async (
  userPrincipal: Principal,
  tokenPrices: Record<string, number>,
  getLogo: (symbol: string) => string | undefined,
): Promise<NFT[]> => {
  try {
    const agent = new HttpAgent({ host: 'https://ic0.app' })
    const collectionsIndexCanisterId = COLLECTIONS_INDEX_CANISTER_ID
    const collectionActor = Actor.createActor<_COLLECTION_SERVICE>(collection_idlFactory, {
      agent,
      canisterId: collectionsIndexCanisterId,
    })

    const timeout = (ms: number) =>
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), ms),
      )

    const fetchCollections = async () => {
      return await collectionActor.get_user_collections([userPrincipal])
    }

    const collectionsResult = await Promise.race([fetchCollections(), timeout(30000)])

    const collections = collectionsResult as Array<{
      name: [] | [string]
      canister_id: Principal
      is_promoted: boolean
      category: [] | [bigint]
    }>

    console.log('collectionsResult', collectionsResult)

    const allNFTs: NFT[] = []

    for (const collection of collections) {
      const canisterId = collection.canister_id.toText()
      const nftActor = Actor.createActor<_GOLD_SERVICE>(nft_idlFactory, {
        agent,
        canisterId,
      })

      const account = {
        owner: userPrincipal,
        subaccount: [] as [],
      }

      const tokenIdsBigInt = await nftActor.icrc7_tokens_of(account, [], [])
      const tokenIds = await Promise.all(
        tokenIdsBigInt.map(async (tokenId: bigint) => {
          const tokenIdStr: string = await nftActor.get_nat_as_token_id_origyn(tokenId)
          return tokenIdStr
        }),
      )

      const nftResults = await nftActor.nft_batch_origyn(tokenIds)

      const nfts: NFT[] = nftResults
        .map((nftResult: any, index: number) => {
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
              owner: userPrincipal.toText(),
              saleDetails: saleDetails || undefined,
            } as NFT
          } else {
            console.error(`Error for token ${tokenIds[index]}: ${nftResult.err.text}`)
            return undefined
          }
        })
        .filter((nft): nft is NFT => nft !== undefined)

      allNFTs.push(...nfts)
    }

    return allNFTs
  } catch (error) {
    console.error('Error in fetchUserNFTs:', error)
    throw error
  }
}

export const useUserNFTs = (userPrincipal: Principal) => {
  const { tokens, getLogo, isLoading: isPricesLoading, isError: isPricesError } = useTokenData()
  console.log('🚀 - useUserNFTs', userPrincipal)

  const tokenUSDPrices: Record<string, number> = tokens.reduce((acc, token) => {
    acc[token.symbol] = token.priceUSD
    return acc
  }, {} as Record<string, number>)

  return useQuery<NFT[], Error>({
    queryKey: ['userNFTs', userPrincipal.toText()],
    queryFn: () => fetchUserNFTs(userPrincipal, tokenUSDPrices, getLogo),
    placeholderData: keepPreviousData,
    enabled: !!userPrincipal && !isPricesLoading && !isPricesError,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
  })
}
