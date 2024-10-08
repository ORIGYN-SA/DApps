// src/hooks/useGetNFTDetails.ts

import { useQuery } from '@tanstack/react-query';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as goldIdlFactory } from '../data/canisters/gold/did.js';
import { _SERVICE as _GOLD_NFT_SERVICE } from '../data/canisters/gold/interfaces/gld_nft.js';
import { NFT, SaleDetails, Metadata } from '../types/global';
import { extractSaleDetails } from '../utils/priceUtils';
import { convertPrincipalArrayToString } from '../utils/principalUtils';
import { hasClass, hasMap } from '../utils/typeGuards';
import { useCurrencyPrice } from '../context/CurrencyPriceContext';

/**
 * Extracts the token name from metadata.
 */
const extractTokenName = (metadata: Metadata): string => {
  if (hasClass(metadata)) {
    const nameField = metadata.Class.find((field) => field.name === 'id' && field.value?.Text);
    return nameField?.value?.Text || 'Unknown';
  } else if (hasMap(metadata)) {
    return 'Unknown';
  }
  return 'Unknown';
};

/**
 * Extracts the owner from metadata.
 */
const extractOwner = (metadata: Metadata): string => {
  if (hasClass(metadata)) {
    const ownerField = metadata.Class.find(
      (field) => field.name === 'owner' && field.value?.Principal,
    );
    if (ownerField && ownerField.value.Principal?._arr) {
      const ownerArr = ownerField.value.Principal._arr;
      return convertPrincipalArrayToString(Object.values(ownerArr));
    }
  } else if (hasMap(metadata)) {
    return 'Unknown';
  }
  return 'Unknown';
};

/**
 * Generates the image URL based on canister ID and token name.
 */
const generateImageUrl = (canisterId: string, tokenName: string): string => {
  return `https://prptl.io/-/${canisterId}/-/${tokenName}/preview`;
};

/**
 * Fetches NFT details, using the exchange rate from the CurrencyPriceContext.
 */
const fetchNFTDetails = async (
  canisterId: string,
  nftId: string,
  exchangeRates: { [key: string]: number },
): Promise<NFT> => {
  try {
    const agent = new HttpAgent({ host: 'https://ic0.app' });
    const actor = Actor.createActor<_GOLD_NFT_SERVICE>(goldIdlFactory, {
      agent,
      canisterId,
    });

    const collectionResult = await actor.collection_nft_origyn([]);

    let collectionName = 'Unknown';
    if ('ok' in collectionResult && Array.isArray(collectionResult.ok.name)) {
      collectionName = collectionResult.ok.name[0] || 'Unknown';
    }

    const nftResult = await actor.nft_batch_origyn([nftId]);

    const nft: NFT[] = nftResult
      .map((nftResultItem) => {
        if ('ok' in nftResultItem) {
          const metadata = nftResultItem.ok.metadata as Metadata;
          const tokenName = extractTokenName(metadata);
          const imageUrl = generateImageUrl(canisterId, tokenName);

          const owner = extractOwner(metadata);

          const saleData = nftResultItem.ok.current_sale ? nftResultItem.ok.current_sale[0] : null;
          const saleDetails: SaleDetails | null = extractSaleDetails(saleData, exchangeRates);

          let price = 0;
          let priceUSD = 0;
          let currency = '';

          // Déterminez le prix en fonction des détails de la vente
          if (saleDetails) {
            price =
              parseFloat(saleDetails.currentBid.amount.toFixed(2)) ||
              parseFloat(saleDetails.buyNow.amount.toFixed(2)) ||
              parseFloat(saleDetails.startPrice.amount.toFixed(2));
            currency = saleDetails.currency;
            priceUSD = exchangeRates[currency]
              ? parseFloat((price * exchangeRates[currency]).toFixed(2))
              : 0;
          }

          return {
            id: nftId,
            name: tokenName,
            collectionName,
            image: imageUrl,
            price,
            currency,
            priceUSD,
            saleDetails: saleDetails || undefined,
            owner,
          } as NFT;
        }
      })
      .filter((nft): nft is NFT => nft !== undefined);

    return nft[0];
  } catch (error) {
    console.error('Error in fetchNFTDetails:', error);
    throw error;
  }
};

/**
 * Custom hook to get NFT details using React Query and exchange rate from the context.
 */
export const useGetNFTDetails = (canisterId: string, nftId: string) => {
  const { prices, isLoading, isError } = useCurrencyPrice();

  return useQuery<NFT, Error, NFT, [string, string, string]>({
    queryKey: ['collectionDetail', canisterId, nftId],
    queryFn: () => fetchNFTDetails(canisterId, nftId, prices),
    enabled: !!canisterId && !!nftId && !isLoading && !isError,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
