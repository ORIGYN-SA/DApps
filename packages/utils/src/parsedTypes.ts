import { AuctionStateStable, ICTokenSpec } from './actorTypes';

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
  displayPropertes: DisplayProperty[];
  primaryRoyalties: Royalty[];
  secondaryRoyalties: Royalty[];
  socialLinks: SocialLink[];
}

export interface OdcDataWithSale extends OdcData {
  // sale_type auction info
  saleId: string;
  auction: AuctionStateStable | undefined;
  auctionOpen: boolean;
  auctionClosed: boolean;
  auctionNotStarted: boolean;
  buyNow: number;
  minIncreaseAmount: number;
  minIncreasePercentage: number;
  currentBid: number;
  tokenSymbol: string;
  token: ICTokenSpec;
  // dutch auction
  startPrice: number;
  reserve: number;
  decayPerHour: number;
}
