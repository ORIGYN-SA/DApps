// Importation des types et modules nécessaires
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Actor, HttpAgent } from '@dfinity/agent'
import { idlFactory as goldIdlFactory } from '../canisters/gld_nft/did.js'
import {
  _SERVICE as _GOLD_NFT_SERVICE,
  GetTransactionsResult,
  Value__1,
} from '../canisters/gld_nft/interfaces/gld_nft.js'
import { useAuth } from '../auth/index'
import { Principal } from '@dfinity/principal'
import { convertPrincipalArrayToString } from '../utils/principalUtils.js'

interface TokenData {
  symbol: string
  decimals: number
}

interface TransactionType {
  type: string
  from: string | string[] | 'N/A'
  to: string | string[] | 'N/A'
  amount: number | null
  token: {
    data: TokenData
  }
  seller?: string
  buyer?: string
}

interface Transaction {
  index: string | number
  timestamp: number | null
  txn_type: TransactionType
  formattedAmount: string
  tokenId: string
}

export const useGetNFTActivity = (
  tokenId: string,
  start: bigint,
  length: bigint,
): UseQueryResult<Transaction[], Error> => {
  const { createActor } = useAuth()

  const fetchUserActivity = async (
    tokenId: string,
    start: bigint,
    length: bigint,
  ): Promise<Transaction[]> => {
    try {
      const actor = createActor('gld_nft_1g')
      const dataBlocksResponse = (await actor.icrc3_get_blocks([
        { start, length },
      ])) as GetTransactionsResult

      const extractedCanisterId = convertPrincipalArrayToString(
        dataBlocksResponse.archived_blocks[0].callback[0]._arr,
      )

      const agent = new HttpAgent({ host: 'https://ic0.app' })
      const blockActor = Actor.createActor<_GOLD_NFT_SERVICE>(goldIdlFactory, {
        agent,
        canisterId: extractedCanisterId,
      })

      const datasFromBlockResponse = (await blockActor.icrc3_get_blocks([
        { start, length },
      ])) as GetTransactionsResult

      const extractValue = (value: Value__1): any => {
        if (typeof value !== 'object' || value === null) return value

        if ('Int' in value) return value.Int.toString()
        if ('Nat' in value) return value.Nat.toString()
        if ('Text' in value) return value.Text
        if ('Blob' in value) {
          const uint8array = new Uint8Array(value.Blob)
          try {
            return Principal.fromUint8Array(uint8array).toText()
          } catch {
            return Array.from(value.Blob)
              .map(byte => byte.toString(16).padStart(2, '0'))
              .join('')
          }
        }
        if ('Array' in value) return value.Array.map(extractValue)
        if ('Map' in value) {
          return value.Map.reduce((acc, [key, val]) => {
            acc[key] = extractValue(val)
            return acc
          }, {} as Record<string, any>)
        }
        return null
      }

      const formattedData: Transaction[] = datasFromBlockResponse.blocks
        .map(block => {
          const blockData = extractValue(block.block)

          const transaction: Transaction = {
            index: blockData?.index || block.id.toString(),
            timestamp: blockData?.tx?.ts ? Number(blockData.tx.ts) : null,
            txn_type: {
              type: blockData?.btype || 'Unknown',
              from: blockData?.tx?.from ? extractValue(blockData.tx.from) : 'N/A',
              to: blockData?.tx?.to ? extractValue(blockData.tx.to) : 'N/A',
              amount: blockData?.tx?.amount ? Number(blockData.tx.amount) : null,
              token: {
                data: {
                  symbol: blockData?.tx?.token?.symbol || '',
                  decimals: blockData?.tx?.token?.decimals
                    ? Number(blockData.tx.token.decimals)
                    : 8,
                },
              },
              seller: blockData?.tx?.seller || undefined,
              buyer: blockData?.tx?.buyer || undefined,
            },
            formattedAmount: blockData?.tx?.amount
              ? (
                  Number(blockData.tx.amount) / Math.pow(10, blockData.tx?.token?.decimals || 8)
                ).toFixed(2)
              : 'N/A',
            tokenId: blockData?.tx?.tokenid || 'N/A',
          }

          return transaction
        })
        .filter(transaction => transaction.tokenId === tokenId)

      return formattedData
    } catch (error) {
      console.error('Error fetching NFT activity:', error)
      throw error instanceof Error ? error : new Error('Error fetching NFT activity')
    }
  }

  return useQuery<Transaction[], Error>({
    queryKey: ['getNFTActivity', tokenId],
    queryFn: () => fetchUserActivity(tokenId, start, length),
    placeholderData: oldData => oldData,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  })
}
