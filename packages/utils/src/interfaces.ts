import { AuctionStateStable, ICTokenSpec, EscrowRecord } from '@origyn/mintjs';

export enum RoyaltyType {
  primary,
  secondary,
}

export interface DisplayProperty {
  name: string;
  value: string;
}

export interface Royalty {
  tag: string;
  rate: number;
}

export interface SocialLink {
  type: string;
  url: string;
}

export interface OdcData {
  // root properties info
  id: string;
  ownerPrincipalId: string;
  originatorPrincipalId: string;
  nodePrincipalId: string;
  networkPrincipalId: string;

  hasPrimaryAsset: boolean;
  hasPreviewAsset: boolean;
  hasHiddenAsset: boolean;
  hasExperienceAsset: boolean;
  // __app > data info
  collectionId: string | undefined;
  displayName: string;
  description: string;
  displayProperties: DisplayProperty[];
  primaryRoyalties: Royalty[];
  secondaryRoyalties: Royalty[];
  socialLinks: SocialLink[];
}

export interface OdcDataWithSale extends OdcData {
  // sale_type auction info
  saleId: string;
  auction: AuctionStateStable | undefined;
  isDutchAuction: boolean;
  auctionOpen: boolean;
  auctionClosed: boolean;
  auctionNotStarted: boolean;
  buyNow: number;
  minIncreaseAmount: bigint;
  minIncreasePercentage: number;
  currentBid: number;
  tokenSymbol: string;
  token: ICTokenSpec;
  // dutch auction
  startPrice: number;
  reserve: number;
  decayPerHour: number;
}

//Interface transaction
export interface Transactions {
  //Common
  trans_index: string;
  token_id: string;
  type_txn: string;
  message: string;
  accounts: string[];
  principals: string[];
  //Specs
  buyer?: {};
  amount?: string;
  token?: {};
  sale_id?: string;
  mint_from?: string;
  mint_to?: string;
  sale?: {};
  seller?: {};
  pricing_config?: {};
  type_of_pricing_config?: string;
  extensible?: {};
  to?: {};
  from?: {};
  fee?: string;
  trx_id?: {};
}
//Interface pricingconfiguration
export interface PricingConfiguration {
  //Common
  txn_id: string;
  token_id: string;
  type_txn: string;
  type_of_pricing_config: string;
  //Specs
  amount?: string;
  token?: {};
  start_price?: string;
  decay_per_hour?: string;
  reserve?: string;
  start_date?: string;
  ending_date?: {};
  buy_now?: string;
  min_increase?: string;
}
//interface Sale
export interface Sale {
  token?: string | {};
  amount?: string;
}
//interface row
export interface Row {
  index: string;
  date: string;
  id_token: string;
  type_txn: string;
}

export interface WaitForQuiet {
  date: string;
  extention: string;
  fade: string;
  max: string;
}

export interface TypeTransactionId {
  _nat: string;
  _text: string;
  _extensible: string;
}

// Interface for filter
export interface Filter {
  searchInputValue: string;
  categoryToFilter: string;
  transactionType: string;
  update: number;
}

export interface ReceivedActiveBidsProps extends OdcDataWithSale {
  token_id: string;
  isNftOwner: boolean;
  escrow_record: EscrowRecord;
  amount: string;
}

export interface SentActiveBidsProps extends OdcDataWithSale {
  token_id: string;
  latest_bid: string;
}

export interface ReceivedOffersProps extends OdcDataWithSale {
  token_id: string;
  amount: string;
  escrow_record: EscrowRecord;
  isNftOwner: boolean;
}

export interface SentOffersProps extends OdcDataWithSale {
  token_id: string;
  amount: string;
  lock_to_date: any;
  escrow_record: EscrowRecord;
}
