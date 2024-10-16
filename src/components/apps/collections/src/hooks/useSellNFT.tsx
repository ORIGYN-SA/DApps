// hooks/useSellNFT.ts
import { useMutation } from '@tanstack/react-query'
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

  const sellNFT = async ({
    nftId,
    price,
    token,
  }: SellNFTVariables): Promise<MarketTransferResult> => {
    try {
      const actor = createActor('gld_nft_1g')

      const feesInToken = BigInt(Math.ceil(token.feesUSD / token.priceUSD))
      const scaledPrice = BigInt(price) * BigInt(10 ** token.decimals)

      const tokenSpec: TokenSpec = {
        ic: {
          id: token.id ? [token.id] : [],
          fee: [feesInToken],
          decimals: BigInt(token.decimals),
          canister: Principal.fromText(token.canister),
          standard: { Ledger: null },
          symbol: token.symbol,
        },
      }

      const askFeatures: AskFeature[] = [
        { token: tokenSpec },
        { buy_now: scaledPrice },
        { fee_schema: 'com.origyn.royalties.fixed' },
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
      console.log('NFT sold successfully:', data)
    },
    onError: error => {
      console.error('Error while selling NFT:', error)
    },
    retry: 1,
  })
}
