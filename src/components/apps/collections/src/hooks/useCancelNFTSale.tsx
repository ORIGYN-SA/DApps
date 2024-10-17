import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../auth/index'

interface CancelSaleVariables {
  saleId: string
}

export const useCancelNFTSale = () => {
  const { createActor } = useAuth()

  const cancelSale = async ({ saleId }: CancelSaleVariables): Promise<void> => {
    try {
      const actor = createActor('gld_nft_1g')

      const manageSaleRequest = {
        end_sale: saleId,
      }

      const result = await actor.sale_nft_origyn(manageSaleRequest)

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
