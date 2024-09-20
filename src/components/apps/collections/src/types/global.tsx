export interface CollectionType {
  name: string;
  checked: boolean;
  image: string;
  category_id?: string;
  nftCount: bigint;
  canister_id: string;
  is_promoted: boolean;
}

export interface CollectionsBackendResponse {
  collections: CollectionType[];
  totalPages: number;
}

export interface CollectionAdditionalData {
  canisterId: string;
  image?: string;
  nftCount?: bigint;
}

export interface CollectionWithNFTs {
  name: [] | [string];
  canister_id: string;
  logo: [] | [string];
  nfts: NFT[];
}

export interface NFT {
  id: string;
  name: string;
  collectionName: string;
  image: string;
  price: string;
}
