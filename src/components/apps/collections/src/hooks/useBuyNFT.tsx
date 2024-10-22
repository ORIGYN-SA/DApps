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

    // Convertir l'ID du token
    const convertedTokenId = await convertTokenId(nftId, nftActor)

    console.log('convertedTokenId', convertedTokenId)

    let tokenIdString: string
    let tokenIdBigInt: bigint

    if (typeof convertedTokenId === 'bigint') {
      tokenIdBigInt = convertedTokenId
      tokenIdString = convertedTokenId.toString()
    } else if (typeof convertedTokenId === 'string') {
      tokenIdString = convertedTokenId
      tokenIdBigInt = BigInt(tokenIdString)
    } else {
      throw new Error('Invalid converted token ID type')
    }

    // Préparer la requête saleInfo
    const saleInfoRequest: SaleInfoRequest = {
      escrow_info: {
        token: {
          ic: {
            id: token.id ? [token.id] : [],
            fee: [BigInt(Math.ceil(token.feesUSD / token.priceUSD))],
            decimals: BigInt(token.decimals),
            canister: Principal.fromText(token.canister),
            standard: { Ledger: null },
            symbol: token.symbol,
          },
        },
        token_id: nftId || '',
        seller: {
          account: {
            owner: seller,
            sub_account: [], // [] | [Subaccount]
          },
        },
        buyer: {
          account: {
            owner: buyer,
            sub_account: [], // [] | [Subaccount]
          },
        },
        amount: price,
      },
    }

    console.log('SaleInfoRequest:', saleInfoRequest)

    // Appeler le canister pour obtenir saleInfo
    const saleInfoResponse = await saleActor.sale_info_nft_origyn(saleInfoRequest)

    console.log('SaleInfoResponse', saleInfoResponse)

    if ('err' in saleInfoResponse) {
      throw new Error(`Error fetching sale info: ${saleInfoResponse.err.text}`)
    }

    const saleInfo = saleInfoResponse.ok

    if (!('escrow_info' in saleInfo)) {
      throw new Error('No escrow information found in the sale info response.')
    }

    const escrowInfo: SubAccountInfo = saleInfo.escrow_info

    // Vérifier que 'account' existe dans 'escrow_info'
    if (!escrowInfo.account) {
      throw new Error('Escrow account information is missing.')
    }

    const buyerAccount = escrowInfo.account

    // Conversion de 'sub_account' de Uint8Array à Array<number>
    const subaccount: [] | [Array<number>] =
      buyerAccount.sub_account.length > 0 ? [Array.from(buyerAccount.sub_account)] : []

    const transferArgs: TransferArg = {
      to: {
        owner: buyerAccount.principal,
        subaccount: subaccount, // [] | [Array<number>]
      },
      fee: [], // Ou [BigInt(feeValue)] si nécessaire
      memo: [], // [] | [Array<number>]
      from_subaccount: [], // [] | [Array<number>]
      created_at_time: [], // [] | [bigint]
      amount: price, // Assurez-vous que 'price' est de type bigint
    }

    console.log('TransferArgs:', transferArgs)

    // Appeler le canister pour transférer les fonds
    const transferResult: Result = await escrowActor.icrc1_transfer(transferArgs)

    console.log('TransferResult:', transferResult)

    // Vérifier la validité du format de la réponse
    if (!('Ok' in transferResult) && !('Err' in transferResult)) {
      throw new Error('Invalid transfer result format.')
    }

    if ('Err' in transferResult) {
      const err = transferResult.Err
      let errorMessage = 'Unknown transfer error.'

      // Extraire le message d'erreur sans sérialiser l'objet entier
      if ('GenericError' in err) {
        errorMessage = err.GenericError.message
      } else if ('InsufficientAllowance' in err) {
        errorMessage = 'Insufficient allowance for transfer.'
      } else if ('BadFee' in err) {
        errorMessage = `Bad fee: expected ${err.BadFee.expected_fee}`
      }
      // Ajoutez d'autres cas d'erreur si nécessaire

      throw new Error(`Error transferring NFT: ${errorMessage}`)
    }

    // Si aucun 'Err', alors c'est 'Ok' et la transaction a réussi
    const okValue = transferResult.Ok
    console.log('Transfer succeeded with value:', okValue)

    // Vérifier que la vente est créée
    if (!escrowInfo.account_id_text) {
      throw new Error('Sale ID is missing in escrowInfo.')
    }

    console.log('Sale ID:', saleId)

    console.log('tokenid', token.id)

    // Préparer la requête bid
    const bidRequest: BidRequest = {
      config: [],
      escrow_record: {
        token: {
          ic: {
            id: token.id ? [token.id] : [],
            fee: [BigInt(Math.ceil(token.feesUSD / token.priceUSD))],
            decimals: BigInt(token.decimals),
            canister: Principal.fromText(token.canister),
            standard: { Ledger: null },
            symbol: token.symbol,
          },
        },
        token_id: nftId,
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
        sale_id: [saleId], // Assurez-vous que c'est un tableau contenant la vente ID
        account_hash: [],
      },
    }

    console.log('BidRequest:', bidRequest)

    // Préparer la requête manageSale
    const manageSaleRequest: ManageSaleRequest = {
      bid: bidRequest,
    }

    console.log('ManageSaleRequest:', manageSaleRequest)

    // Appeler le canister pour effectuer le bid
    const purchaseResult = await saleActor.sale_nft_origyn(manageSaleRequest)

    console.log('purchaseResult:', purchaseResult)

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
      // Afficher seulement le message d'erreur pour éviter la sérialisation de BigInt
      console.error('Error while buying NFT:', error.message)
    },
    retry: 1,
  })
}
