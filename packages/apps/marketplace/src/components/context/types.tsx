export interface AppData {
  collection_id: string | undefined;
  display_name: string;
  description: string;
  custom_properties: any[];
}

export interface OdcData {
  odcID: string;
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
  odcData: OdcData[] | undefined;
  filter: string | undefined;
  sort: string | undefined;
  filteredOdcData: OdcData[] | undefined;
};

export type MarketplaceAction =
  | { type: 'totalItems'; payload: number }
  | { type: 'collectionPreview'; payload: string }
  | { type: 'collectionData'; payload: {} }
  | { type: 'odcData'; payload: OdcData[] }
  | { type: 'filter'; payload: string }
  | { type: 'sort'; payload: string }
  | { type: 'filteredOdcData'; payload: OdcData[] };
