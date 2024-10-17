import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query'
import { Actor, HttpAgent } from '@dfinity/agent'
import { idlFactory, Result_2, Result_3 } from '../canisters/collections/collection_index.did.js'
import { _SERVICE } from '../canisters/collections/collection_index.did.js'
import { _SERVICE as _GOLD_SERVICE } from '../canisters/gld_nft/interfaces/gld_nft.js'
import { idlFactory as goldIdlFactory } from '../canisters/gld_nft/did.js'
import {
  CollectionsBackendResponse,
  CollectionAdditionalData,
  CollectionType,
} from '../types/global'
import { extractCategoryName } from '../utils/categoryUtils.js'
import { COLLECTIONS_INDEX_CANISTER_ID } from '../constants.js'

const fetchCollectionsList = async (
  offset: number,
  limit: number,
  categories: [] | [BigUint64Array | bigint[]] = [],
): Promise<CollectionsBackendResponse> => {
  const agent = new HttpAgent({ host: 'https://ic0.app' })
  const canisterId = COLLECTIONS_INDEX_CANISTER_ID
  const actor = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
  })

  const collectionsResult: Result_3 = await actor.get_collections({
    categories,
    offset: BigInt(offset),
    limit: BigInt(limit),
  })

  if ('Ok' in collectionsResult) {
    const { collections, total_pages } = collectionsResult.Ok

    const sortedCollections = collections
      .sort((a, b) => (a.is_promoted === b.is_promoted ? 0 : a.is_promoted ? -1 : 1))
      .map(collection => ({
        ...collection,
        checked: true,
        canister_id: collection.canister_id.toText(),
      }))

    const totalPages = Number(total_pages)

    const canisterIds = sortedCollections.map(collection => collection.canister_id)

    const additionalData: CollectionAdditionalData[] = await fetchAllCollectionsData(canisterIds)

    const mergedCollections: CollectionType[] = await Promise.all(
      sortedCollections.map(async collection => {
        const data = additionalData.find(item => item.canisterId === collection.canister_id)
        const category_name = await extractCategoryName(collection.category)

        return {
          name: collection.name[0] || 'Unknown',
          checked: collection.checked,
          image: data?.image || '',
          category_name,
          nftCount: data?.nftCount || BigInt(0),
          canister_id: collection.canister_id,
          is_promoted: collection.is_promoted,
        }
      }),
    )

    return { collections: mergedCollections, totalPages }
  } else {
    throw new Error(`Error fetching collections: ${collectionsResult.Err.CategoryNotFound}`)
  }
}

const fetchCollectionData = async (
  canisterId: string,
): Promise<CollectionAdditionalData | null> => {
  try {
    const agent = new HttpAgent({
      host: 'https://ic0.app',
    })

    const collectionActor = Actor.createActor<_GOLD_SERVICE>(goldIdlFactory, {
      agent,
      canisterId: canisterId,
    })

    const result = await collectionActor.collection_nft_origyn([])

    if ('ok' in result) {
      const logo = result.ok.logo[0]
      const totalSupply = result.ok.total_supply[0]

      return {
        canisterId,
        image: logo,
        nftCount: totalSupply,
      }
    } else {
      console.error(`Error for the canister ${canisterId}`, result.err)
      return null
    }
  } catch (error) {
    console.error(`Error while retrieving data for the canister ${canisterId}`, error)
    return null
  }
}

const fetchAllCollectionsData = async (
  canisterIds: string[],
): Promise<CollectionAdditionalData[]> => {
  const MAX_CONCURRENT_REQUESTS = 5
  const results: Array<CollectionAdditionalData | null> = []

  for (let i = 0; i < canisterIds.length; i += MAX_CONCURRENT_REQUESTS) {
    const chunk = canisterIds.slice(i, i + MAX_CONCURRENT_REQUESTS)
    const promises = chunk.map(canisterId => fetchCollectionData(canisterId))
    const chunkResults = await Promise.all(promises)
    results.push(...chunkResults)
  }

  return results.filter((data): data is CollectionAdditionalData => data !== null)
}

export const useGetCollectionsList = (
  offset: number,
  limit: number,
): UseQueryResult<CollectionsBackendResponse, Error> =>
  useQuery<CollectionsBackendResponse, Error>({
    queryKey: ['collectionsList', offset, limit],
    queryFn: () => fetchCollectionsList(offset, limit),
    placeholderData: keepPreviousData,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  })
