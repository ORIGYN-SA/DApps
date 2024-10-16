export interface CollectionType {
  name: string
  checked: boolean
  image: string
  category_name: string
  nftCount: bigint
  canister_id: string
  is_promoted: boolean
}

export interface CollectionsBackendResponse {
  collections: CollectionType[]
  totalPages: number
}

export interface CollectionAdditionalData {
  canisterId: string
  image?: string
  nftCount?: bigint
}

export interface SaleDetails {
  currentBid: {
    amount: number
    amountUSD: number | null
  }
  buyNow: {
    amount: number
    amountUSD: number | null
  }
  startPrice: {
    amount: number
    amountUSD: number | null
  }
  currency: string
  saleId: string | null
  startDate: string | null
  endDate: string | null
  winner: any[]
  participants: any[]
}

export interface NFT {
  id: string
  name: string
  collectionName: string
  categoryName: string
  image: string
  logo: string | undefined
  price: number
  currency: string
  priceUSD: number
  owner: string
  saleDetails?: SaleDetails
}

export interface CollectionWithNFTs {
  name: string[]
  canister_id: string
  categoryName: string
  logo: string[]
  nfts: NFT[]
}

export interface Principal {
  _arr: Record<number, number>
  _isPrincipal: boolean
}

export interface Participant {
  principal: Principal
  bidAmount: string
}
export interface PrincipalValue {
  _arr: number[]
  _isPrincipal: boolean
}

export interface ValueClass {
  Principal?: PrincipalValue
  Text?: string
  Bool?: boolean
  // Add other possible types if necessary
}

export interface ClassField {
  value: ValueClass
  name: string
  immutable: boolean
}

export interface MetadataWithClass {
  Class: ClassField[]
}

export interface MapEntry {
  0: any
  1: any
}

export interface CandyShared {
  Map: MapEntry[]
}

// Union type for Metadata
export type Metadata = MetadataWithClass | CandyShared
