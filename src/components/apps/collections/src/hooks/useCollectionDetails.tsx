import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as goldIdlFactory } from '../data/canisters/gold/did.js';
import {
  _SERVICE as _GOLD_NFT_SERVICE,
  CandyShared,
} from '../data/canisters/gold/interfaces/gld_nft.js';
import { CollectionWithNFTs, NFT, SaleDetails } from '../types/global.js';
import { extractSaleDetails } from '../utils/priceUtils';
import { useCurrencyPrice } from '../context/CurrencyPriceContext.js';

const fetchCollectionDetail = async (
  canisterId: string,
  exchangeRates: Record<string, number>,
): Promise<CollectionWithNFTs> => {
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

    console.log('collection result', collectionResult);

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
    const limitedTokenIds = tokenIds;

    const nftResults = await actor.nft_batch_origyn(limitedTokenIds);

    const nfts: NFT[] = nftResults
      .map((nftResult, index) => {
        if ('ok' in nftResult) {
          const { tokenName, imageUrl } = extractMetadata(nftResult.ok.metadata, canisterId);

          const saleData =
            nftResult.ok.current_sale && nftResult.ok.current_sale.length > 0
              ? nftResult.ok.current_sale[0]
              : null;

              console.log('saleData', saleData);

          const saleDetails: SaleDetails | null = extractSaleDetails(saleData, exchangeRates);

          console.log('saleDetails', saleDetails);

          let price = 0;
          let priceUSD = 0;
          let currency = '';

          if (saleDetails) {
            if (saleDetails.currentBid.amount > 0) {
              price = parseFloat(saleDetails.currentBid.amount.toFixed(2));
            } else if (saleDetails.buyNow.amount > 0) {
              price = parseFloat(saleDetails.buyNow.amount.toFixed(2));
            } else if (saleDetails.startPrice.amount > 0) {
              price = parseFloat(saleDetails.startPrice.amount.toFixed(2));
            }
            currency = saleDetails.currency;
            priceUSD = exchangeRates[currency]
              ? parseFloat((price * exchangeRates[currency]).toFixed(2))
              : 0;
          }

          return {
            id: limitedTokenIds[index],
            name: tokenName,
            collectionName: canisterId,
            image: imageUrl,
            price,
            currency,
            priceUSD,
            saleDetails: saleDetails || undefined,
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
    console.error('Error in fetchCollectionDetail:', error);
    throw error;
  }
};

const generateImageUrl = (canisterId: string, assetName: string): string => {
  return `https://prptl.io/-/${canisterId}/-/${assetName}/preview`;
};

const extractMetadata = (
  metadata: CandyShared,
  canisterId: string,
): { tokenName: string; imageUrl: string } => {
  let tokenName = 'Unknown';
  let imageUrl = '';

  if ('Class' in metadata) {
    const classProperties = metadata.Class;
    console.log('classProperties', classProperties);

    const nameField = classProperties.find(
      (field: any) => field.name === 'id' && 'Text' in field.value,
    );
    if (nameField && 'Text' in nameField.value) {
      tokenName = nameField.value.Text;
    }

    const imageField = classProperties.find(
      (field: any) => field.name === 'primary_asset' && 'Text' in field.value,
    );
    if (imageField && 'Text' in imageField.value) {
      imageUrl = generateImageUrl(canisterId, tokenName);
    }
  } else {
    console.warn('The metadata does not contain a Class type.');
    if ('Text' in metadata) {
      tokenName = metadata.Text;
    }
  }

  return { tokenName, imageUrl };
};

export const useCollectionDetails = (canisterId: string) => {
  const { prices: exchangeRates } = useCurrencyPrice();

  return useQuery({
    queryKey: ['collectionDetail', canisterId],
    queryFn: () => fetchCollectionDetail(canisterId, exchangeRates),
    placeholderData: keepPreviousData,
    enabled: !!canisterId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
