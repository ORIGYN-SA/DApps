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
  filteredOdcData: OdcData[] | undefined;
};

export type MarketplaceAction =
  | { type: 'totalItems'; payload: number }
  | { type: 'collectionPreview'; payload: string }
  | { type: 'collectionData'; payload: {} }
  | { type: 'odcData'; payload: OdcData[] }
  | { type: 'filteredOdcData'; payload: OdcData[] };
