import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Principal } from '@dfinity/principal'
import {
  _SERVICE as SaleService,
  SaleInfoRequest,
  ManageSaleRequest,
  ManageSaleResult,
  BidRequest,
  SubAccountInfo,
} from '../canisters/gld_nft/interfaces/gld_nft'
import { _SERVICE as NFT_SERVICE } from '../canisters/gld_nft/interfaces/gld_nft'
import { Result, TransferArg } from '../canisters/ledger/interfaces/ledger'
import LedgerService from '../canisters/ledger/interfaces/ledger'
import { useAuth } from '../auth/index'
import { convertTokenId } from '../utils/metadataUtils'
import { OGY_TX_FEE } from '../constants'

export interface SaleToken {
  feesUSD: number
  priceUSD: number
  decimals: number
  canister: string
  standard: 'ICRC1' | 'EXTFungible' | 'DIP20' | 'Ledger' | 'Other'
  symbol: string
  id?: bigint
}

interface BuyNFTVariables {
  nftId: string | bigint
  price: bigint
  token: SaleToken
  buyer: Principal
  seller: Principal
  collectionId: string
  saleId: string
}

export const useBuyNFT = () => {
  const { createActor } = useAuth()
  const queryClient = useQueryClient()

  const buyNFT = async ({
    nftId,
    price,
    token,
    buyer,
    seller,
    saleId,
  }: BuyNFTVariables): Promise<ManageSaleResult> => {
    const saleActor = createActor('gld_nft_1g') as unknown as SaleService
    const nftActor = createActor('gld_nft_1g') as unknown as NFT_SERVICE
    const escrowActor = createActor('ogy_ledger') as unknown as LedgerService

    const feesInToken = OGY_TX_FEE

    const saleInfoRequest: SaleInfoRequest = {
      escrow_info: {
        token: {
          ic: {
            id: token.id ? [token.id] : [],
            fee: [BigInt(feesInToken)],
            decimals: BigInt(token.decimals),
            canister: Principal.fromText(token.canister),
            standard: { Ledger: null },
            symbol: token.symbol,
          },
        },
        token_id: nftId.toString(),
        seller: {
          account: {
            owner: seller,
            sub_account: [],
          },
        },
        buyer: {
          account: {
            owner: buyer,
            sub_account: [],
          },
        },
        amount: price,
      },
    }

    console.log('1 - SaleInfoRequest:', saleInfoRequest)

    const saleInfoResponse = await saleActor.sale_info_nft_origyn(saleInfoRequest)

    console.log('1 - SaleInfoResponse', saleInfoResponse)

    if ('err' in saleInfoResponse) {
      throw new Error(`Error fetching sale info: ${saleInfoResponse.err.text}`)
    }

    const saleInfo = saleInfoResponse.ok

    if (!('escrow_info' in saleInfo)) {
      throw new Error('No escrow information found in the sale info response.')
    }

    const escrowInfo: SubAccountInfo = saleInfo.escrow_info

    if (!escrowInfo.account) {
      throw new Error('Escrow account information is missing.')
    }

    const buyerAccount = escrowInfo.account

    const subaccount: [] | [Array<number>] =
      buyerAccount.sub_account.length > 0 ? [Array.from(buyerAccount.sub_account)] : []

    const transferArgs: TransferArg = {
      to: {
        owner: buyerAccount.principal,
        subaccount: subaccount,
      },
      fee: [],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount: price,
    }

    console.log('2 - TransferArgs:', transferArgs)

    const transferResult: Result = await escrowActor.icrc1_transfer(transferArgs)

    console.log('2 - TransferResult:', transferResult)

    if (!('Ok' in transferResult) && !('Err' in transferResult)) {
      throw new Error('Invalid transfer result format.')
    }

    if ('Err' in transferResult) {
      const err = transferResult.Err
      let errorMessage = 'Unknown transfer error.'

      if ('GenericError' in err) {
        errorMessage = err.GenericError.message
      } else if ('InsufficientAllowance' in err) {
        errorMessage = 'Insufficient allowance for transfer.'
      } else if ('BadFee' in err) {
        errorMessage = `Bad fee: expected ${err.BadFee.expected_fee}`
      }

      throw new Error(`Error transferring NFT: ${errorMessage}`)
    }

    if (!escrowInfo.account_id_text) {
      throw new Error('Sale ID is missing in escrowInfo.')
    }

    const bidRequest: BidRequest = {
      config: [],
      escrow_record: {
        token: {
          ic: {
            id: token.id ? [token.id] : [],
            fee: [BigInt(feesInToken)],
            decimals: BigInt(token.decimals),
            canister: Principal.fromText(token.canister),
            standard: { Ledger: null },
            symbol: token.symbol,
          },
        },
        token_id: nftId.toString(),
        seller: {
          account: {
            owner: seller,
            sub_account: [],
          },
        },
        buyer: {
          account: {
            owner: buyer,
            sub_account: [],
          },
        },
        lock_to_date: [],
        amount: price,
        sale_id: [saleId],
        account_hash: [],
      },
    }

    const manageSaleRequest: ManageSaleRequest = {
      bid: bidRequest,
    }

    const purchaseResult = await saleActor.sale_nft_origyn(manageSaleRequest)

    console.log('3 - Bid Reponse:', purchaseResult)

    if ('err' in purchaseResult) {
      throw new Error(`Error during the bid: ${purchaseResult.err.text}`)
    }

    return purchaseResult
  }

  return useMutation<ManageSaleResult, Error, BuyNFTVariables>({
    mutationFn: buyNFT,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userNFTs'] })
    },
    onError: error => {
      console.error('Error while buying NFT:', error.message)
    },
    retry: 1,
  })
}
