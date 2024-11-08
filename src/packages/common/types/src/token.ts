import { PublicTokenOverview } from '../../canisters/icpswap/store'

export interface Token extends PublicTokenOverview {
  decimals: number
  isUsable: boolean
  logo?: string
  canister: string
  feesUSD: number
  priceUSD: number
  standard: string
  symbol: string
}
