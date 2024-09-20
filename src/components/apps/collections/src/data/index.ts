import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './canisters/collections/collection_index.did.js';
import { _SERVICE } from '../data/canisters/collections/collection_index.did';
import { _SERVICE as _GOLD_SERVICE } from '../data/canisters/gold/interfaces/gld_nft.js';
import { _SERVICE as _GOLD_NFT_SERVICE } from '../data/canisters/gold/interfaces/gld_nft.ts';
import { idlFactory as goldIdlFactory } from '../data/canisters/gold/did.js';

export interface CollectionType {
  name: string;
  checked: boolean;
  image: string;
  category_id: string;
  nftCount: number;
}

export interface BackendResponse {
  collections: CollectionType[];
  totalPages: number;
}
export const fetchCollectionsList = async (offset: number, limit: number) => {
  const startTime = performance.now();

  try {
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

      const additionalData = await fetchAllCollectionsData(canisterIds);

      const mergedCollections = sortedCollections.map((collection) => {
        const data = additionalData.find((item) => item.canisterId === collection.canister_id);
        return {
          ...collection,
          ...data,
        };
      });

      const endTime = performance.now();
      console.log(`Total fetch time: ${(endTime - startTime).toFixed(2)}ms`); // Temps total

      return { collections: mergedCollections, totalPages };
    } else {
      console.error('Error fetching collections:', collections.Err);
      return { collections: [], totalPages: 0 };
    }
  } catch (error) {
    console.error('Error in fetchCollectionsList:', error);
    return { collections: [], totalPages: 0 };
  } finally {
    const endTime = performance.now(); // Fin de la mesure du temps global, même en cas d'erreur
    console.log(`Total fetch time (including errors): ${(endTime - startTime).toFixed(2)}ms`);
  }
};

const fetchCollectionData = async (canisterId: string) => {
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
      console.error(`Erreur for the canister ${canisterId}`, result.err);
      return null;
    }
  } catch (error) {
    console.error(`Erreur in the retrieval of data for the canister ${canisterId}`, error);
    return null;
  }
};

const fetchAllCollectionsData = async (canisterIds: string[]) => {
  const promises = canisterIds.map(async (canisterId) => {
    return await fetchCollectionData(canisterId);
  });

  const collectionsData = await Promise.all(promises);
  return collectionsData.filter((data) => data !== null);
};

export interface CollectionWithNFTs {
  name: [] | [string];
  canister_id: string;
  logo: [] | [string];
  nfts: NFT[];
}

export interface NFT {
  id: string;
  name: string;
  collectionName: string;
  image: string;
  price: string;
}

const extractTokenName = (metadata: any): string => {
  const nameField = metadata.Class.find((field: any) => field.name === 'id' && field.value?.Text);
  return nameField?.value?.Text || 'Unknown';
};

const generateImageUrl = (canisterId: string, tokenName: string): string => {
  return `https://prptl.io/-/${canisterId}/-/${tokenName}/preview`;
};

export const fetchCollectionDetail = async (
  canisterId: string,
): Promise<{ collectionWithNFTs: CollectionWithNFTs }> => {
  try {
    const startTime = performance.now();
    const agent = new HttpAgent({ host: 'https://ic0.app' });
    const actor = Actor.createActor<_GOLD_NFT_SERVICE>(goldIdlFactory, {
      agent,
      canisterId,
    });

    const collectionResult = await actor.collection_nft_origyn([]);
    if (!('ok' in collectionResult)) {
      throw new Error(`Error while retrieving the collection: ${collectionResult.err.text}`);
    }
    const collectionInfo = collectionResult.ok;

    if (
      !collectionInfo.token_ids ||
      collectionInfo.token_ids.length === 0 ||
      !collectionInfo.token_ids[0]
    ) {
      return {
        collectionWithNFTs: {
          name: [],
          canister_id: canisterId,
          logo: [],
          nfts: [],
        },
      };
    }

    const tokenIds: string[] = collectionInfo.token_ids[0];
    const nftResults = await actor.nft_batch_origyn(tokenIds);

    const nfts: NFT[] = nftResults
      .map((nftResult, index) => {
        if ('ok' in nftResult) {
          const metadata = nftResult.ok.metadata;

          // Utilise la fonction extractTokenName pour récupérer le nom du token
          const tokenName = extractTokenName(metadata);
          const collection = canisterId;

          // Génère l'URL de l'image
          const imageUrl = generateImageUrl(canisterId, tokenName);

          return {
            id: tokenIds[index],
            name: tokenName,
            collectionName: collection,
            image: imageUrl, // Utilise l'URL générée pour l'image
            price: '12 OGY', // Exemple, à ajuster selon tes besoins
          } as NFT;
        } else {
          console.error(`Erreur pour le token ${tokenIds[index]}: ${nftResult.err.text}`);
          return undefined;
        }
      })
      .filter((nft): nft is NFT => nft !== undefined);

    const collectionWithNFTs: CollectionWithNFTs = {
      name: collectionInfo.name || [],
      logo: collectionInfo.logo || [],
      canister_id: canisterId,
      nfts,
    };

    const endTime = performance.now();
    console.log(`Total fetch collection time: ${(endTime - startTime).toFixed(2)}ms`); // Temps total

    return { collectionWithNFTs };
  } catch (error) {
    console.error('Erreur dans fetchCollectionDetail:', error);
    return { collectionWithNFTs: { name: [], canister_id: canisterId, logo: [], nfts: [] } };
  }
};
