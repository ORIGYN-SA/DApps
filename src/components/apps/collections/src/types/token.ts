import { PublicTokenOverview } from '../data/canisters/interfaces/icpswap/store';

export interface Token extends PublicTokenOverview {
  decimals: number;
  isUsable: boolean;
  logo?: string;
}

export interface SaleDetails {
  currentBid: {
    amount: number;
    amountUSD: number | null;
  };
  buyNow: {
    amount: number;
    amountUSD: number | null;
  };
  startPrice: {
    amount: number;
    amountUSD: number | null;
  };
  currency: string;
  saleId: string | null;
  startDate: string | null;
  endDate: string | null;
  winner: any[];
  participants: any[];
}

export interface NFT {
  id: string;
  name: string;
  collectionName: string;
  image: string;
  price: number;
  currency: string;
  priceUSD: number;
  saleDetails?: SaleDetails;
}

export interface CollectionWithNFTs {
  name: string[];
  canister_id: string;
  logo: string[];
  nfts: NFT[];
}