import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Principal } from '@dfinity/principal'
import {
  _SERVICE as SaleService,
  MarketTransferResult,
  MarketTransferRequest,
  SalesConfig,
  PricingConfigShared,
  AskConfigShared,
  AskFeature,
  TokenSpec,
} from '../canisters/gld_nft/interfaces/gld_nft'
import { useAuth } from '../auth/index'
import { OGY_TX_FEE } from '../constants'

export interface SaleToken {
  feesUSD: number
  priceUSD: number
  decimals: number
  canister: string
  standard: 'ICRC1' | 'ICRC2' | 'EXTFungible' | 'DIP20' | 'Ledger' | 'Other'
  symbol: string
  id?: bigint
}

interface SellNFTVariables {
  nftId: string
  price: bigint
  collectionId: string
  token: SaleToken
}

export const useSellNFT = () => {
  const { createActor } = useAuth()
  const queryClient = useQueryClient()

  const sellNFT = async ({
    nftId,
    price,
    token,
  }: SellNFTVariables): Promise<MarketTransferResult> => {
    try {
      const actor = createActor('gld_nft_1g')

      const feesInToken = OGY_TX_FEE
      const scaledPrice = BigInt(price) * BigInt(10 ** token.decimals)
      const startDate = BigInt(Date.now()) * BigInt(1_000_000)
      const endDate = startDate + BigInt(3600 * 24 * 30 * 1_000_000_000)

      const tokenSpec: TokenSpec = {
        ic: {
          id: token.id ? [token.id] : [],
          fee: [BigInt(feesInToken)],
          decimals: BigInt(token.decimals),
          canister: Principal.fromText(token.canister),
          standard: { Ledger: null },
          symbol: token.symbol,
        },
      }

      const askFeatures: AskFeature[] = [
        { token: tokenSpec },
        { buy_now: scaledPrice },
        { ending: { date: endDate } },
        { start_date: startDate },
        { start_price: scaledPrice },
        { reserve: scaledPrice },
      ]

      const askConfigShared: AskConfigShared = [askFeatures]

      const pricing: PricingConfigShared = { ask: askConfigShared }

      const salesConfig: SalesConfig = {
        broker_id: [],
        pricing,
        escrow_receipt: [],
      }

      const marketTransferRequest: MarketTransferRequest = {
        token_id: nftId,
        sales_config: salesConfig,
      }

      const result = await actor.market_transfer_nft_origyn(marketTransferRequest)

      return result as MarketTransferResult
    } catch (error) {
      console.error('Error while selling NFT:', error)
      throw error
    }
  }

  return useMutation<MarketTransferResult, Error, SellNFTVariables>({
    mutationFn: sellNFT,
    onSuccess: data => {
      if (data && 'err' in data && data.err) {
        throw new Error(data.err.flag_point || 'Unknown error in market transfer response')
      } else {
        console.log('NFT sold successfully:', data)
        queryClient.invalidateQueries({ queryKey: ['userNFTs'] })
      }
    },
    onError: error => {
      console.error('Error while selling NFT:', error)
    },
    retry: 1,
  })
}
