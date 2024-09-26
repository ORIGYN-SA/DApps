import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as goldIdlFactory } from '../data/canisters/gold/did.js';
import { _SERVICE as _GOLD_NFT_SERVICE } from '../data/canisters/gold/interfaces/gld_nft.js'; // Assurez-vous que l'extension est .js
import { NFT } from '../types/global.js';

const fetchNFTDetails = async (canisterId: string, nftId: string): Promise<NFT> => {
  try {
    const agent = new HttpAgent({ host: 'https://ic0.app' });
    const actor = Actor.createActor<_GOLD_NFT_SERVICE>(goldIdlFactory, {
      agent,
      canisterId,
    });

    console.log('nftId', nftId);
    console.log('canisterId', canisterId);

    const nftResult = await actor.nft_batch_origyn([nftId]);

    const nft: NFT[] = nftResult
    .map((nftResult, index) => {
      if ('ok' in nftResult) {
        const metadata = nftResult.ok.metadata;
        const tokenName = extractTokenName(metadata);
        const collection = canisterId;
        const imageUrl = generateImageUrl(canisterId, tokenName);
  
        return {
          id: nftId, // Pass the single nftId, no need for [index]
          name: tokenName,
          collectionName: collection,
          image: imageUrl,
          price: '12 OGY',
        } as NFT;
      }
    })
      .filter((nft): nft is NFT => nft !== undefined);

      console.log('nft', nft);

    return nft[0];
  } catch (error) {
    console.error('Error in fetchNFTDetails:', error);
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

export const useGetNFTDetails = (canisterId: string, nftId: string) => {
  return useQuery<NFT>({
    queryKey: ['collectionDetail', canisterId, nftId],
    queryFn: () => fetchNFTDetails(canisterId, nftId),
    enabled: !!canisterId && !!nftId,
  });
};
