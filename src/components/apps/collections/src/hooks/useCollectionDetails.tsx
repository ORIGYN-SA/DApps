import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as goldIdlFactory } from '../data/canisters/gold/did.js';
import { _SERVICE as _GOLD_NFT_SERVICE } from '../data/canisters/gold/interfaces/gld_nft.js'; // Assurez-vous que l'extension est .js
import { CollectionWithNFTs, NFT } from '../types/global.js';

const fetchCollectionDetail = async (canisterId: string): Promise<CollectionWithNFTs> => {
  try {
    const agent = new HttpAgent({ host: 'https://ic0.app' });
    const actor = Actor.createActor<_GOLD_NFT_SERVICE>(goldIdlFactory, {
      agent,
      canisterId,
    });

    const collectionResult = await actor.collection_nft_origyn([]);
    if (!('ok' in collectionResult)) {
      throw new Error(`Error during the retrieval of the collection: ${collectionResult.err.text}`);
    }
    const collectionInfo = collectionResult.ok;

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
      };
    }

    const tokenIds: string[] = collectionInfo.token_ids[0];

    // const MAX_TOKENS = 50; // Limit to improv performance
    // const limitedTokenIds = tokenIds.slice(0, MAX_TOKENS);

    // Use every token
    const limitedTokenIds = tokenIds;

    const nftResults = await actor.nft_batch_origyn(limitedTokenIds);

    const nfts: NFT[] = nftResults
      .map((nftResult, index) => {
        if ('ok' in nftResult) {
          const metadata = nftResult.ok.metadata;
          const tokenName = extractTokenName(metadata);
          const collection = canisterId;
          const imageUrl = generateImageUrl(canisterId, tokenName);

          return {
            id: limitedTokenIds[index],
            name: tokenName,
            collectionName: collection,
            image: imageUrl,
            price: '12 OGY',
          } as NFT;
        } else {
          console.error(`Error for token ${limitedTokenIds[index]}: ${nftResult.err.text}`);
          return undefined;
        }
      })
      .filter((nft): nft is NFT => nft !== undefined);

    return {
      name: collectionInfo.name || [],
      logo: collectionInfo.logo || [],
      canister_id: canisterId,
      nfts,
    };
  } catch (error) {
    console.error('Error in  fetchCollectionDetail:', error);
    throw error;
  }
};

const extractTokenName = (metadata: any): string => {
  const nameField = metadata.Class.find((field: any) => field.name === 'id' && field.value?.Text);
  return nameField?.value?.Text || 'Unknown';
};

const generateImageUrl = (canisterId: string, tokenName: string): string => {
  return `https://prptl.io/-/${canisterId}/-/${tokenName}/preview`;
};

export const useCollectionDetails = (canisterId: string) => {
  return useQuery({
    queryKey: ['collectionDetail', canisterId],
    queryFn: () => fetchCollectionDetail(canisterId),
    placeholderData: keepPreviousData,
    enabled: !!canisterId,
  });
};
