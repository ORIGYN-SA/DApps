import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './canisters/collections/collection_index.did.js';
import { Principal } from '@dfinity/principal';
import { _SERVICE } from '../data/canisters/collections/collection_index.did';
import { _SERVICE as _GOLD_SERVICE } from '../data/canisters/gold/interfaces/gld_nft.js';
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

// export const fetchCollectionsFromBackend = async (
//   page: number,
//   itemsPerPage: number,
// ): Promise<BackendResponse> => {
//   try {
//     const agent = new HttpAgent({ host: 'https://ic0.app' });
//     const canisterId = 'io7gn-vyaaa-aaaak-qcbiq-cai';
//     const actor = Actor.createActor<_SERVICE>(idlFactory, {
//       agent,
//       canisterId,
//     });

//     const logoResult = await actor.icrc7_logo();

//     const collectionResult = await actor.collection_nft_origyn([]);
//     if (!('ok' in collectionResult)) {
//       throw new Error(`Error while retrieving the collection: ${collectionResult.err.text}`);
//     }
//     const collectionInfo = collectionResult.ok;

//     if (!collectionInfo.token_ids || collectionInfo.token_ids.length === 0) {
//       return { collections: [], totalPages: 0 };
//     }

//     // ! DEV ONLY :  limit added to the number of tokens to be fetched
//     const tokenIds = collectionInfo.token_ids[0].slice(0, 50);

//     const nftResults = await actor.nft_batch_origyn(tokenIds);
//     console.log('nftResults', nftResults);

//     const collections: CollectionType[] = nftResults
//       .map((nftResult, index) => {
//         if ('ok' in nftResult) {
//           const metadata = nftResult.ok.metadata;
//           const name = extractName(metadata);
//           const category_id = extractCreator(metadata);
//           const nftCount = 1;
//           return {
//             name,
//             checked: true,
//             image: logoResult ? logoResult : '',
//             category_id,
//             nftCount,
//           };
//         } else {
//           console.error(`Error for the token ${tokenIds[index]}: ${nftResult.err.text}`);
//           return undefined;
//         }
//       })
//       .filter((item): item is CollectionType => item !== undefined);

//     const totalPages = Math.ceil(collections.length / itemsPerPage);

//     return {
//       collections,
//       totalPages,
//     };
//   } catch (error) {
//     console.error('Error in fetchCollectionsFromBackend:', error);
//     return { collections: [], totalPages: 0 };
//   }
// };

export const fetchCollectionsList = async (offset: number, limit: number) => {
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
      return { collections: mergedCollections, totalPages };
    } else {
      console.error('Error fetching collections:', collections.Err);
      return { collections: [], totalPages: 0 };
    }
  } catch (error) {
    console.error('Error in fetchCollectionsList:', error);
    return { collections: [], totalPages: 0 };
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

// Fonction pour récupérer les données de tous les canisters de la liste
const fetchAllCollectionsData = async (canisterIds: string[]) => {
  const promises = canisterIds.map(async (canisterId) => {
    return await fetchCollectionData(canisterId);
  });

  const collectionsData = await Promise.all(promises);
  return collectionsData.filter((data) => data !== null);
};

export interface NFT {
  id: string;
  name: string;
  collectionName: string;
  image: string;
  subtitle: string;
  price: string;
}

// export const fetchCollectionDetail = async (
//   collectionName: string | undefined,
// ): Promise<{ nfts: NFT[] }> => {
//   try {
//     const agent = new HttpAgent({ host: 'https://ic0.app' });
//     const canisterId = 'io7gn-vyaaa-aaaak-qcbiq-cai';
//     const actor = Actor.createActor<_SERVICE>(idlFactory, {
//       agent,
//       canisterId,
//     });

//     // Récupère toutes les collections
//     const collectionResult = await actor.collection_nft_origyn([]);
//     if (!('ok' in collectionResult)) {
//       throw new Error(
//         `Erreur lors de la récupération de la collection : ${collectionResult.err.text}`,
//       );
//     }
//     const collectionInfo = collectionResult.ok;

//     // Vérifiez que token_ids[0] existe
//     if (
//       !collectionInfo.token_ids ||
//       collectionInfo.token_ids.length === 0 ||
//       !collectionInfo.token_ids[0]
//     ) {
//       return { nfts: [] };
//     }

//     const tokenIds: string[] = collectionInfo.token_ids[0];
//     const nftResults = await actor.nft_batch_origyn(tokenIds);

//     const nfts: NFT[] = nftResults
//       .map((nftResult, index) => {
//         if ('ok' in nftResult) {
//           const metadata = nftResult.ok.metadata;
//           const name = extractName(metadata);
//           const collection = extractName(metadata);
//           if (collection !== collectionName) return undefined;
//           return {
//             id: tokenIds[index],
//             name,
//             collectionName: collection,
//             image: 'https://via.placeholder.com/243x244',
//             subtitle: 'Subtitle if needed',
//             price: '12 OGY',
//           } as NFT;
//         } else {
//           console.error(`Erreur pour le token ${tokenIds[index]}: ${nftResult.err.text}`);
//           return undefined;
//         }
//       })
//       .filter((nft): nft is NFT => nft !== undefined);

//     return { nfts };
//   } catch (error) {
//     console.error('Erreur dans fetchCollectionDetail:', error);
//     return { nfts: [] };
//   }
// };
