import { useMutation } from '@tanstack/react-query'
import { Principal } from '@dfinity/principal'
import { ApproveArgs, Result_2 } from '../canisters/ledger/interfaces'
import { TransferArgs, TransferResult } from '../canisters/gld_nft/interfaces/gld_nft'
import { Actor, HttpAgent } from '@dfinity/agent'
import { _SERVICE as _NFT_SERVICE } from '../canisters/gld_nft/interfaces/gld_nft'
import { idlFactory as nftIdlFactory } from '../canisters/gld_nft/did.js'
import { NFT } from '../types/global'
import { OGY_TX_FEE } from '../constants'
import { useAuth } from '../auth/hooks/useAuth'
import { convertTokenId } from '../utils/metadataUtils'

export const useTransferNFT = () => {
  const { createActor } = useAuth()

  const icrc2_approve = async (arg: ApproveArgs): Promise<Result_2> => {
    try {
      const actor = createActor('ogy_ledger')
      const result = await actor.icrc2_approve(arg)
      console.log('icrc2_approve result', result)
      return result as Result_2
    } catch (error) {
      console.error('Error in icrc2_approve:', error)
      throw new Error('Approval failed')
    }
  }

  const icrc7_transfer = async (canister: string, arg: TransferArgs): Promise<TransferResult> => {
    try {
      const actor = createActor('gld_nft_1g')
      const result = await actor.icrc7_transfer([arg])
      console.log('icrc7_transfer result', result)
      return result as TransferResult
    } catch (error) {
      console.error('Error in icrc7_transfer:', error)
      throw new Error('Transfer failed')
    }
  }

  return useMutation({
    mutationKey: ['useTransferNFT'],
    mutationFn: async ({
      to,
      nft,
      fee,
      canisterId,
    }: {
      to: string
      nft: NFT
      fee: number
      canisterId: string
    }): Promise<void> => {
      if (!nft.id) {
        console.error('NFT id is missing', nft)
        throw new Error('Invalid NFT data')
      }

      const amount = BigInt(fee * 10 ** 8 + OGY_TX_FEE)
      const icrc2_approve_args: ApproveArgs = {
        amount,
        fee: [],
        memo: [],
        expected_allowance: [],
        created_at_time: [],
        expires_at: [],
        spender: {
          owner: Principal.fromText(canisterId),
          subaccount: [],
        },
        from_subaccount: [],
      }

      const approveResult = await icrc2_approve(icrc2_approve_args)
      console.log('approveResult', approveResult)

      if ('Err' in approveResult) {
        console.error('Approve error:', approveResult.Err)
        throw new Error('Transfer error! Approve transaction failed.')
      }

      const nftActor = Actor.createActor<_NFT_SERVICE>(nftIdlFactory, {
        agent: new HttpAgent({ host: 'https://ic0.app' }),
        canisterId,
      })

      const convertedTokenId = await convertTokenId(nft.id, nftActor)

      const icrc7_transfer_args: TransferArgs = {
        to: {
          owner: Principal.fromText(to),
          subaccount: [],
        },
        token_id: BigInt(convertedTokenId),
        memo: [],
        from_subaccount: [],
        created_at_time: [],
      }

      const transferResult = await icrc7_transfer(canisterId, icrc7_transfer_args)
      console.log('transferResult', transferResult)

      if ('Err' in transferResult) {
        console.error('Transfer error:', transferResult.Err)
        throw new Error('Transfer error! Transfer transaction failed.')
      }
    },
  })
}
