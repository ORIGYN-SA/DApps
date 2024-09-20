import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../data/canisters/collections/collection_index.did.js';
import { _SERVICE } from '../data/canisters/collections/collection_index.did';
import { _SERVICE as _GOLD_SERVICE } from '../data/canisters/gold/interfaces/gld_nft.js';
import { idlFactory as goldIdlFactory } from '../data/canisters/gold/did.js';
import {
  CollectionsBackendResponse,
  CollectionAdditionalData,
  CollectionType,
} from '../types/global';

const fetchCollectionsList = async (
  offset: number,
  limit: number,
): Promise<CollectionsBackendResponse> => {
  const agent = new HttpAgent({ host: 'https://ic0.app' });
  const canisterId = 'lnt3k-ciaaa-aaaaj-azsaq-cai';
  const actor = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
  });

  const collections = await actor.get_collections({
    offset: BigInt(offset),
    limit: BigInt(limit),
  });

  if ('Ok' in collections) {
    const sortedCollections = collections.Ok.sort((a, b) => {
      return a.is_promoted === b.is_promoted ? 0 : a.is_promoted ? -1 : 1;
    }).map((collection) => ({
      ...collection,
      checked: true,
      canister_id: collection.canister_id.toText(),
    }));

    const totalPages = Math.ceil(sortedCollections.length / limit);

    const canisterIds = sortedCollections.map((collection) => collection.canister_id);

    const additionalData: CollectionAdditionalData[] = await fetchAllCollectionsData(canisterIds);

    const mergedCollections: CollectionType[] = sortedCollections.map((collection) => {
      const data = additionalData.find((item) => item.canisterId === collection.canister_id);

      const category_id = extractCategoryId(collection.category);

      return {
        name: collection.name[0] || 'Unknown',
        checked: collection.checked,
        image: data?.image || '',
        category_id,
        nftCount: data?.nftCount || BigInt(0),
        canister_id: collection.canister_id,
        is_promoted: collection.is_promoted,
      };
    });

    return { collections: mergedCollections, totalPages };
  } else {
    throw new Error(`Error fetching collections: ${collections.Err}`);
  }
};

const fetchCollectionData = async (
  canisterId: string,
): Promise<CollectionAdditionalData | null> => {
  try {
    const agent = new HttpAgent({
      host: 'https://ic0.app',
    });

    const collectionActor = Actor.createActor<_GOLD_SERVICE>(goldIdlFactory, {
      agent,
      canisterId: canisterId,
    });

    const result = await collectionActor.collection_nft_origyn([]);

    if ('ok' in result) {
      const logo = result.ok.logo[0];
      const totalSupply = result.ok.total_supply[0];

      return {
        canisterId,
        image: logo,
        nftCount: totalSupply,
      };
    } else {
      console.error(`Error for the canister ${canisterId}`, result.err);
      return null;
    }
  } catch (error) {
    console.error(`Error while retrieving data for the canister ${canisterId}`, error);
    return null;
  }
};

const fetchAllCollectionsData = async (
  canisterIds: string[],
): Promise<CollectionAdditionalData[]> => {
  const MAX_CONCURRENT_REQUESTS = 5;
  const results: Array<CollectionAdditionalData | null> = [];

  for (let i = 0; i < canisterIds.length; i += MAX_CONCURRENT_REQUESTS) {
    const chunk = canisterIds.slice(i, i + MAX_CONCURRENT_REQUESTS);
    const promises = chunk.map((canisterId) => fetchCollectionData(canisterId));
    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults);
  }

  return results.filter((data): data is CollectionAdditionalData => data !== null);
};

function isNonEmptyCategory(
  category: [] | [BigUint64Array | bigint[]],
): category is [BigUint64Array | bigint[]] {
  return category.length > 0;
}

const extractCategoryId = (category: [] | [BigUint64Array | bigint[]]): string => {
  if (isNonEmptyCategory(category)) {
    const categoryValue = category[0];
    return categoryValue.toString();
  }
  return '';
};

export const useGetCollectionsList = (
  offset: number,
  limit: number,
): UseQueryResult<CollectionsBackendResponse, Error> =>
  useQuery({
    queryKey: ['collectionsList', offset, limit],
    queryFn: () => fetchCollectionsList(offset, limit),
    placeholderData: keepPreviousData,
  });
