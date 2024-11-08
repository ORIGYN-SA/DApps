import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Principal } from '@dfinity/principal'
import { Result, TransferArg, TransferError } from '../../canisters/ledger/interfaces/ledger'
import { useAuth } from '@dapp/features-authentication'
import { currencies } from '@dapp/common-constants'

interface TransferVariables {
  to: string
  amount: bigint
  currency: string
}

export const useTokensTransfer = () => {
  const { createActor } = useAuth()
  const queryClient = useQueryClient()

  const transferTokens = async ({ to, amount, currency }: TransferVariables) => {
    try {
      const currencyData = currencies.find(curr => curr.code === currency)
      if (!currencyData) {
        throw new Error(`Currency ${currency} not found`)
      }

      const actor = createActor(currencyData.canisterId)

      const transferArg: TransferArg = {
        to: {
          owner: Principal.fromText(to),
          subaccount: [],
        },
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount,
      }
      const result = (await actor.icrc1_transfer(transferArg)) as Result

      if ('Err' in result) {
        const error = result.Err as TransferError
        if ('GenericError' in error) {
          throw new Error(error.GenericError.message)
        } else if ('BadFee' in error) {
          throw new Error(`Expected fee: ${error.BadFee.expected_fee}`)
        } else if ('InsufficientFunds' in error) {
          throw new Error(`Insufficient funds. Balance: ${error.InsufficientFunds.balance}`)
        } else if ('Duplicate' in error) {
          throw new Error(`Duplicate transaction. Duplicate of: ${error.Duplicate.duplicate_of}`)
        } else if ('CreatedInFuture' in error) {
          throw new Error(
            `Transaction created in future. Ledger time: ${error.CreatedInFuture.ledger_time}`,
          )
        } else if ('BadBurn' in error) {
          throw new Error(`Minimum burn amount: ${error.BadBurn.min_burn_amount}`)
        } else {
          throw new Error('Transfer temporarily unavailable or too old')
        }
      }

      return result.Ok
    } catch (error) {
      console.error('Error during token transfer:', error)
      throw error instanceof Error ? error : new Error('Token transfer failed')
    }
  }

  return useMutation({
    mutationFn: transferTokens,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokenBalances'] })
    },
    onError: error => {
      console.error('Transfer failed:', error)
      throw new Error('Transfer failed')
    },
    retry: 1,
  })
}
