// hooks/useGetNFTActivity.ts

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Actor, HttpAgent } from '@dfinity/agent'
import { idlFactory as goldIdlFactory } from '../canisters/gld_nft/did.js'
import {
  _SERVICE as _GOLD_NFT_SERVICE,
  TransactionRecord,
  HistoryResult,
  Account__2,
} from '../canisters/gld_nft/interfaces/gld_nft.js'
import { Principal } from '@dfinity/principal'
interface TokenData {
  symbol: string
  decimals: number
}

interface TransactionType {
  type: string
  from: string | 'N/A'
  to: string | 'N/A'
  amount: string | null
  token: {
    data: TokenData
  }
  seller?: string
  buyer?: string
}

export interface Transaction {
  index: string
  timestamp: string | null
  txn_type: TransactionType
  formattedAmount: string
  tokenId: string
}

const getAddressString = (account: Account__2): string => {
  if ('account_id' in account) {
    return account.account_id
  } else if ('principal' in account) {
    return account.principal.toText()
  } else if ('account' in account) {
    return account.account.owner.toText()
  } else {
    return 'N/A'
  }
}

export const useGetNFTActivity = (
  tokenId: string,
  canisterId: string,
): UseQueryResult<Transaction[], Error> => {
  const fetchUserActivity = async (tokenId: string, canisterId: string): Promise<Transaction[]> => {
    try {
      const agent = new HttpAgent({ host: 'https://ic0.app' })
      const actor = Actor.createActor<_GOLD_NFT_SERVICE>(goldIdlFactory, {
        agent,
        canisterId,
      })

      const response: HistoryResult = await actor.history_nft_origyn(tokenId, [], [])
      if ('err' in response) {
        throw new Error('Failed to fetch history')
      }

      const formattedData: Transaction[] = response.ok.map((record: TransactionRecord) => {
        const transactionTypeKey = Object.keys(record.txn_type)[0]
        const transactionData = record.txn_type[transactionTypeKey]

        let from: string = 'N/A'
        let to: string = 'N/A'
        let amount: string | null = null
        let symbol = ''
        let decimals = 8
        let timestamp: string | null = null

        if (record.timestamp) {
          timestamp = record.timestamp.toString()
        }

        switch (transactionTypeKey) {
          case 'sale_opened':
            if (
              transactionData?.pricing?.ask &&
              Array.isArray(transactionData.pricing.ask) &&
              transactionData.pricing.ask.length > 0
            ) {
              from = transactionData?.account?.account?.owner
                ? getAddressString(transactionData.account)
                : 'N/A'
              const ask = transactionData.pricing.ask[0]
              const buyNowEntry = ask.find((entry: any) => 'buy_now' in entry)
              if (buyNowEntry && buyNowEntry.buy_now) {
                amount = buyNowEntry.buy_now.toString()
              }
              const tokenEntry = ask.find((entry: any) => 'token' in entry)
              if (tokenEntry && tokenEntry.token && tokenEntry.token.ic) {
                symbol = tokenEntry.token.ic.symbol || ''
                decimals = tokenEntry.token.ic.decimals ? Number(tokenEntry.token.ic.decimals) : 8
              }
            }
            break

          case 'fee_deposit_withdraw':
            from = transactionData?.account?.account?.owner
              ? getAddressString(transactionData.account)
              : 'N/A'
            amount = transactionData.amount ? transactionData.amount.toString() : null
            if (transactionData?.token?.ic) {
              symbol = transactionData.token.ic.symbol || ''
              decimals = transactionData.token.ic.decimals
                ? Number(transactionData.token.ic.decimals)
                : 8
            }
            break

          case 'royalty_paid':
            from = transactionData?.buyer?.account?.owner
              ? getAddressString(transactionData.buyer)
              : 'N/A'
            to = transactionData?.receiver?.account?.owner
              ? getAddressString(transactionData.receiver)
              : 'N/A'
            amount = transactionData.amount ? transactionData.amount.toString() : null
            if (transactionData?.token?.ic) {
              symbol = transactionData.token.ic.symbol || ''
              decimals = transactionData.token.ic.decimals
                ? Number(transactionData.token.ic.decimals)
                : 8
            }
            break

          case 'owner_transfer':
            from = transactionData?.from?.account?.owner
              ? getAddressString(transactionData.from)
              : 'N/A'
            to = transactionData?.to?.account?.owner ? getAddressString(transactionData.to) : 'N/A'
            break

          case 'escrow_deposit':
            from = transactionData?.seller?.account?.owner
              ? getAddressString(transactionData.seller)
              : 'N/A'
            to = transactionData?.buyer?.account?.owner
              ? getAddressString(transactionData.buyer)
              : 'N/A'
            amount = transactionData.amount ? transactionData.amount.toString() : null
            if (transactionData?.token?.ic) {
              symbol = transactionData.token.ic.symbol || ''
              decimals = transactionData.token.ic.decimals
                ? Number(transactionData.token.ic.decimals)
                : 8
            }
            break

          case 'sale_ended':
            from = transactionData?.seller?.account?.owner
              ? getAddressString(transactionData.seller)
              : 'N/A'
            to = transactionData?.buyer?.account?.owner
              ? getAddressString(transactionData.buyer)
              : 'N/A'
            amount = transactionData.amount ? transactionData.amount.toString() : null
            if (transactionData?.token?.ic) {
              symbol = transactionData.token.ic.symbol || ''
              decimals = transactionData.token.ic.decimals
                ? Number(transactionData.token.ic.decimals)
                : 8
            }
            break

          default:
            console.warn(`Unhandled transaction type: ${transactionTypeKey}`)
            break
        }

        let formattedAmount = 'N/A'
        if (amount !== null) {
          try {
            const amountBigInt = BigInt(amount)
            const decimalsFactor = BigInt(10) ** BigInt(decimals)
            const integerPart = amountBigInt / decimalsFactor
            const fractionalPart = amountBigInt % decimalsFactor

            let fractionalStr = fractionalPart.toString().padStart(decimals, '0')
            fractionalStr = fractionalStr.replace(/0+$/, '')

            formattedAmount = fractionalStr
              ? `${integerPart.toString()}.${fractionalStr}`
              : integerPart.toString()
          } catch (e) {
            console.error('Error formatting amount:', e)
          }
        }

        const transaction: Transaction = {
          index: record.index.toString(),
          timestamp: timestamp,
          txn_type: {
            type: transactionTypeKey,
            from,
            to,
            amount,
            token: {
              data: {
                symbol,
                decimals,
              },
            },
            seller: from !== 'N/A' ? from : undefined,
            buyer: to !== 'N/A' ? to : undefined,
          },
          formattedAmount,
          tokenId: record.token_id,
        }

        return transaction
      })

      const sortedData = formattedData
        .filter(transaction => transaction.tokenId === tokenId)
        .sort((a, b) => {
          const timestampA = a.timestamp ? BigInt(a.timestamp) : BigInt(0)
          const timestampB = b.timestamp ? BigInt(b.timestamp) : BigInt(0)

          if (timestampA === timestampB) {
            const indexA = BigInt(a.index)
            const indexB = BigInt(b.index)
            if (indexA < indexB) return -1
            if (indexA > indexB) return 1
            return 0
          }

          return timestampB < timestampA ? -1 : 1
        })

      return sortedData
    } catch (error) {
      console.error('Error fetching NFT activity:', error)
      throw error instanceof Error ? error : new Error('Error fetching NFT activity')
    }
  }

  return useQuery<Transaction[], Error>({
    queryKey: ['getNFTActivity', tokenId],
    queryFn: () => fetchUserActivity(tokenId, canisterId),
    placeholderData: oldData => oldData,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  })
}
