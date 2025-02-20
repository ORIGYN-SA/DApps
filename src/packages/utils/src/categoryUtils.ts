import { Actor, HttpAgent } from '@dfinity/agent';
import {
  idlFactory,
  _SERVICE as CollectionService,
} from '../../common/canisters/collections/collection_index.did.js';
import { Principal } from '@dfinity/principal';
import { COLLECTIONS_INDEX_CANISTER_ID } from '@dapp/common-constants';

let categoriesCache: Record<string, { active: boolean; collectionCount: number }>;

/**
 * Fetches all categories from the canister and stores them in the cache.
 */
export const fetchCategories = async (): Promise<
  Record<string, { active: boolean; collectionCount: number }>
> => {
  if (categoriesCache) {
    return categoriesCache;
  }

  const agent = new HttpAgent({ host: 'https://icp-api.io' });
  const canisterId = COLLECTIONS_INDEX_CANISTER_ID;
  if (!canisterId) {
    throw new Error('COLLECTIONS_INDEX_CANISTER_ID is undefined.');
  }
  const actor = Actor.createActor<CollectionService>(idlFactory, {
    agent,
    canisterId,
  });

  const categoriesResult = await actor.get_categories();
  console.log('🚀 ~ categoriesResult:', categoriesResult);

  if ('Ok' in categoriesResult) {
    categoriesCache = categoriesResult.Ok.reduce(
      (acc: Record<string, { active: boolean; collectionCount: number }>, category) => {
        const [categoryId, categoryData] = category;
        acc[categoryId] = {
          active: categoryData.active,
          collectionCount: Number(categoryData.collection_count),
        };
        return acc;
      },
      {},
    );
    console.log('🚀 ~ categoriesCache:', categoriesCache);

    return categoriesCache;
  } else {
    throw new Error('Error fetching categories');
  }
};

/**
 * Extracts category name using the cached or fetched categories.
 */
export const extractCategoryName = async (category: string): Promise<string> => {
  if (!categoriesCache) {
    await fetchCategories();
  }

  if (category.length > 0) {
    const categoryId = category;
    console.log('🚀 ~ extractCategoryName ~ categoryId:', categoryId);
    if (!categoryId) {
      return 'Unknown Category';
    }
    const categoryData = categoriesCache?.[categoryId];
    return categoryData?.active ? categoryId : 'Unknown Category';
  }

  return '';
};

/**
 * Checks if the category is non-empty.
 */
export const isNonEmptyCategory = (category: [] | [string]): category is [string] => {
  return category.length > 0;
};

/**
 *
 * Fetch category by principal id
 */

export const fetchCategoryByPrincipalId = async (principalId: string): Promise<string> => {
  if (!categoriesCache) {
    await fetchCategories();
  }

  const agent = new HttpAgent({ host: 'https://ic0.app' });
  const canisterId = COLLECTIONS_INDEX_CANISTER_ID;
  if (!canisterId) {
    throw new Error('COLLECTIONS_INDEX_CANISTER_ID is undefined.');
  }
  const actor = Actor.createActor<CollectionService>(idlFactory, {
    agent,
    canisterId,
  });

  const principal = Principal.fromText(principalId);
  const collectionsResult = await actor.get_collection_by_principal(principal);

  if ('Ok' in collectionsResult) {
    const category = collectionsResult.Ok.category;

    if (category.length > 0) {
      const categoryId = category[0];
      if (!categoryId) {
        return 'Unknown Category';
      }
      const categoryData = categoriesCache?.[categoryId];
      return categoryData?.active ? categoryId : 'Unknown Category';
    }
  }

  throw new Error('Collection not found or error in fetching collection by principal');
};
