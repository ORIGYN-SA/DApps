import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../auth/index'
import { ManageSaleResult } from '../canisters/gld_nft/interfaces/gld_nft'

interface CancelSaleVariables {
  tokenId: string
}

export const useCancelNFTSale = () => {
  const { createActor } = useAuth()

  const cancelSale = async ({ tokenId }: CancelSaleVariables): Promise<void> => {
    try {
      const actor = createActor('gld_nft_1g')

      console.log('tokenId', tokenId)

      const manageSaleRequest = {
        end_sale: tokenId,
      }

      const result = (await actor.sale_nft_origyn(manageSaleRequest)) as ManageSaleResult

      if ('err' in result) {
        throw new Error(`Error cancelling sale: ${result.err.text}`)
      }

      console.log('Sale cancelled successfully:', result)
    } catch (error) {
      console.error('Error while cancelling the sale:', error)
      throw error
    }
  }

  return useMutation<void, Error, CancelSaleVariables>({
    mutationFn: cancelSale,
    onSuccess: () => {
      console.log('Sale cancellation successful')
    },

    onError: error => {
      console.error('Error cancelling the sale:', error)
    },
    retry: 1,
  })
}
