export interface AppData {
  collection_id: string | undefined;
  display_name: string;
  description: string;
  custom_properties: any[];
}

export interface OdcData {
  hasPreviewImage: boolean;
  odcID: string;
  onSale: boolean;
  currentBid: number;
  buyNow: number;
  token: string;
  appData: AppData;
}

export type VaultState = {
  collectionPreview: string | undefined;
  originatorPrincipal: string | undefined;
  collectionData: any | undefined;
  odcData: OdcData[] | undefined;
  filter: string | undefined;
  sort: string | undefined;
  filteredOdcData: OdcData[] | undefined;
  escrows: any[] | undefined;
  offers: any[] | undefined;
  ownedItems: number;
};

export type VaultAction =
  | { type: 'ownedItems'; payload: number }
  | { type: 'collectionPreview'; payload: string }
  | { type: 'originatorPrincipal'; payload: string }
  | { type: 'collectionData'; payload: {} }
  | { type: 'odcData'; payload: OdcData[] }
  | { type: 'filter'; payload: string }
  | { type: 'sort'; payload: string }
  | { type: 'filteredOdcData'; payload: OdcData[] }
  | { type: 'escrows'; payload: any[] }
  | { type: 'offers'; payload: any[] };
