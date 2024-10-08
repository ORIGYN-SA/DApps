import { Actor, HttpAgent } from '@dfinity/agent';
import {
  idlFactory,
  _SERVICE as CollectionService,
} from '../data/canisters/collections/collection_index.did.js';

let categoriesCache: Record<string, string> | null = null;

/**
 * Fetches all categories from the canister and stores them in the cache.
 */
export const fetchCategories = async (): Promise<Record<string, string>> => {
  if (categoriesCache) {
    return categoriesCache;
  }

  const agent = new HttpAgent({ host: 'https://ic0.app' });
  const canisterId = 'lnt3k-ciaaa-aaaaj-azsaq-cai';
  const actor = Actor.createActor<CollectionService>(idlFactory, {
    agent,
    canisterId,
  });

  const categoriesResult = await actor.get_categories();

  if ('Ok' in categoriesResult) {
    categoriesCache = categoriesResult.Ok.reduce((acc: Record<string, string>, category) => {
      const categoryId = category[0].toString();
      const categoryName = category[1].name;
      acc[categoryId] = categoryName;
      return acc;
    }, {});

    return categoriesCache;
  } else {
    throw new Error('Error fetching categories');
  }
};

/**
 * Extracts category name using the cached or fetched categories.
 */
export const extractCategoryName = async (category: [] | [bigint]): Promise<string> => {
  if (!categoriesCache) {
    await fetchCategories();
  }

  if (isNonEmptyCategory(category)) {
    const categoryId = category[0].toString();
    const categoryName = categoriesCache?.[categoryId];
    return categoryName || 'Unknown Category';
  }

  return '';
};

/**
 * Checks if the category is non-empty.
 */
export const isNonEmptyCategory = (category: [] | [bigint]): category is [bigint] => {
  return category.length > 0;
};
