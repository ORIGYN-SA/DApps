import { OdcData, OdcDataWithSale } from '@dapp/utils';

export type MarketplaceState = {
  totalItems: number | undefined;
  collectionData: OdcData | undefined;
  odcs: OdcDataWithSale[] | undefined;
  filter: string | undefined;
  sort: string | undefined;
  filteredOdcs: OdcDataWithSale[] | undefined;
};

export type MarketplaceAction =
  | { type: 'totalItems'; payload: number }
  | { type: 'collectionData'; payload: OdcData }
  | { type: 'odcs'; payload: OdcDataWithSale[] }
  | { type: 'filter'; payload: string }
  | { type: 'sort'; payload: string }
  | { type: 'filteredOdcs'; payload: OdcDataWithSale[] };
