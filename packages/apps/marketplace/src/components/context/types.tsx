export interface AppData {
  collection_id: string | undefined;
  display_name: string;
  description: string;
  custom_properties: any[];
}

export interface NftData {
  nftID: string;
  onSale: boolean;
  currentBid: number;
  buyNow: number;
  token: string;
  appData: AppData;
}

export type MarketplaceState = {
  totalItems: number | undefined;
  collectionPreview: string | undefined;
  collectionData: any | undefined;
  nftData: NftData[] | undefined;
  filteredNftData: NftData[] | undefined;
};

export type MarketplaceAction =
  | { type: 'totalItems'; payload: number }
  | { type: 'collectionPreview'; payload: string }
  | { type: 'collectionData'; payload: {} }
  | { type: 'nftData'; payload: NftData[] }
  | { type: 'filteredNftData'; payload: NftData[] };
