// src/hooks/useGetNFTDetails.ts

import { useQuery } from '@tanstack/react-query';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as goldIdlFactory } from '../data/canisters/gold/did.js';
import { _SERVICE as _GOLD_NFT_SERVICE } from '../data/canisters/gold/interfaces/gld_nft.js';
import { NFT, SaleDetails, Metadata } from '../types/global';
import { extractSaleDetails, fetchExchangeRate } from '../utils/priceUtils';
import { convertPrincipalArrayToString } from '../utils/principalUtils';
import { hasClass, hasMap } from '../utils/typeGuards';

/**
 * Extracts the token name from metadata.
 * @param {Metadata} metadata - The metadata object.
 * @returns {string} - The token name.
 */
const extractTokenName = (metadata: Metadata): string => {
  if (hasClass(metadata)) {
    const nameField = metadata.Class.find(
      (field) => field.name === 'id' && field.value?.Text
    );
    return nameField?.value?.Text || 'Unknown';
  } else if (hasMap(metadata)) {
    // Handle CandyShared type if applicable
    // Adjust based on actual structure and requirements
    return 'Unknown'; // Placeholder
  }
  return 'Unknown';
};

/**
 * Extracts the owner from metadata.
 * @param {Metadata} metadata - The metadata object.
 * @returns {string} - The owner Principal as a string.
 */
const extractOwner = (metadata: Metadata): string => {
  if (hasClass(metadata)) {
    const ownerField = metadata.Class.find(
      (field) => field.name === 'owner' && field.value?.Principal
    );
    if (ownerField && ownerField.value.Principal?._arr) {
      const ownerArr = ownerField.value.Principal._arr;
      return convertPrincipalArrayToString(Object.values(ownerArr));
    }
  } else if (hasMap(metadata)) {
    // Handle CandyShared type if applicable
    // Extract owner from the Map if possible
    // Adjust based on actual structure and requirements
    return 'Unknown'; // Placeholder
  }
  return 'Unknown';
};

/**
 * Generates the image URL based on canister ID and token name.
 * @param {string} canisterId - The canister ID.
 * @param {string} tokenName - The token name.
 * @returns {string} - The image URL.
 */
const generateImageUrl = (canisterId: string, tokenName: string): string => {
  return `https://prptl.io/-/${canisterId}/-/${tokenName}/preview`;
};

/**
 * Fetches NFT details including sale information and converts prices.
 * @param {string} canisterId - The canister ID.
 * @param {string} nftId - The NFT ID.
 * @returns {Promise<NFT>} - The NFT object with formatted details.
 */
const fetchNFTDetails = async (canisterId: string, nftId: string): Promise<NFT> => {
  try {
    const agent = new HttpAgent({ host: 'https://ic0.app' });
    const actor = Actor.createActor<_GOLD_NFT_SERVICE>(goldIdlFactory, {
      agent,
      canisterId,
    });

    console.log('nftId:', nftId);

    // Fetch collection details
    const collectionResult = await actor.collection_nft_origyn([]);
    console.log('nftCollectionResult:', collectionResult);

    // Extract collection name
    let collectionName = 'Unknown';
    if ('ok' in collectionResult && Array.isArray(collectionResult.ok.name)) {
      collectionName = collectionResult.ok.name[0] || 'Unknown';
    }

    const nftResult = await actor.nft_batch_origyn([nftId]);
    console.log('nftResult:', nftResult);

    // Fetch exchange rate
    const exchangeRate = await fetchExchangeRate();

    const nft: NFT[] = nftResult
      .map((nftResultItem) => {
        if ('ok' in nftResultItem) {
          const metadata = nftResultItem.ok.metadata as Metadata;
          const tokenName = extractTokenName(metadata);
          const imageUrl = generateImageUrl(canisterId, tokenName);

          // Extract owner
          const owner = extractOwner(metadata);

          // Extract sale details
          const saleData = nftResultItem.ok.current_sale
            ? nftResultItem.ok.current_sale[0]
            : null;
          const saleDetails: SaleDetails | null = extractSaleDetails(
            saleData,
            exchangeRate
          );

          // Determine the price
          let priceICP = 0;
          let priceUSD = 0;
          if (saleDetails) {
            if (saleDetails.currentBid.amountICP > 0) {
              priceICP = parseFloat(saleDetails.currentBid.amountICP.toFixed(2));
              priceUSD = parseFloat(saleDetails.currentBid.amountUSD.toFixed(2));
            } else if (saleDetails.buyNow.amountICP > 0) {
              priceICP = parseFloat(saleDetails.buyNow.amountICP.toFixed(2));
              priceUSD = parseFloat(saleDetails.buyNow.amountUSD.toFixed(2));
            } else if (saleDetails.startPrice.amountICP > 0) {
              priceICP = parseFloat(
                saleDetails.startPrice.amountICP.toFixed(2)
              );
              priceUSD = parseFloat(
                saleDetails.startPrice.amountUSD.toFixed(2)
              );
            }
          }

          return {
            id: nftId,
            name: tokenName,
            collectionName, // Use the extracted collection name
            image: imageUrl,
            priceICP,
            priceUSD,
            saleDetails: saleDetails || undefined,
            owner, // Add the owner field
          } as NFT;
        }
      })
      .filter((nft): nft is NFT => nft !== undefined);

    console.log('nft:', nft);

    return nft[0];
  } catch (error) {
    console.error('Error in fetchNFTDetails:', error);
    throw error;
  }
};

/**
 * Custom hook to get NFT details using React Query.
 * @param {string} canisterId - The canister ID.
 * @param {string} nftId - The NFT ID.
 * @returns {UseQueryResult<NFT>} - The React Query result.
 */
export const useGetNFTDetails = (canisterId: string, nftId: string) => {
  return useQuery<NFT>({
    queryKey: ['collectionDetail', canisterId, nftId],
    queryFn: () => fetchNFTDetails(canisterId, nftId),
    enabled: !!canisterId && !!nftId,
  });
};
