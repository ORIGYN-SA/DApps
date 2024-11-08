import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Actor, HttpAgent } from '@dfinity/agent'
import { _SERVICE as _NFT_SERVICE } from '../../canisters/gld_nft/interfaces/gld_nft'
import { idlFactory as nftIdlFactory } from '../../canisters/gld_nft/did.js'
import { useEffect, useState } from 'react'
import { convertTokenId, divideBy1e8 } from '@dapp/utils'

export const useFetchTransferFeeNft = ({
  nftId,
  canister,
}: {
  nftId: bigint | string
  canister: string
}) => {
  const [nftIdAsNat, setNftIdAsNat] = useState<bigint | null>(null)

  const nftActor = Actor.createActor<_NFT_SERVICE>(nftIdlFactory, {
    agent: new HttpAgent({ host: 'https://ic0.app' }),
    canisterId: canister,
  })

  useEffect(() => {
    const fetchNftIdAsNat = async () => {
      try {
        if (typeof nftId === 'string') {
          const convertedId = await convertTokenId(nftId, nftActor)
          setNftIdAsNat(BigInt(convertedId))
        } else {
          setNftIdAsNat(nftId)
        }
      } catch (error) {
        console.error('Error converting nftId to Nat:', error)
        throw error
      }
    }

    fetchNftIdAsNat()
  }, [nftId, nftActor])

  const icrc7_transfer_fee = async (): Promise<number | undefined> => {
    try {
      if (nftIdAsNat === null) return undefined

      const result = (await nftActor.icrc7_transfer_fee(nftIdAsNat)) as [] | [bigint]

      if (result.length === 0) {
        return undefined
      }
      return divideBy1e8(result[0])
    } catch (error) {
      console.error('Error fetching transfer fee:', error)
      throw error
    }
  }

  const isQueryEnabled = nftIdAsNat !== null

  return useQuery({
    queryKey: ['getTransferFee', nftIdAsNat?.toString()],
    queryFn: icrc7_transfer_fee,
    placeholderData: keepPreviousData,
    enabled: isQueryEnabled,
  })
}
