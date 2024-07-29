import { OdcData, OdcDataWithSale } from '@dapp/utils';

export type VaultState = {
  ownedItems: number;
  collectionData: OdcData | undefined;
  odcs: OdcDataWithSale[] | undefined;
  filteredOdcs: OdcDataWithSale[] | undefined;
  filter: string | undefined;
  sort: string | undefined;
};

export type VaultAction =
  | { type: 'ownedItems'; payload: number }
  | { type: 'collectionData'; payload: OdcData }
  | { type: 'odcs'; payload: OdcDataWithSale[] }
  | { type: 'filter'; payload: string }
  | { type: 'sort'; payload: string }
  | { type: 'filteredOdcs'; payload: OdcDataWithSale[] | undefined };
