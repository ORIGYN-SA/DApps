import { useQuery } from '@tanstack/react-query'
import { Actor, HttpAgent } from '@dfinity/agent'
import { idlFactory as goldIdlFactory } from '../canisters/gld_nft/did.js'
import { _SERVICE as _GOLD_NFT_SERVICE, Value } from '../canisters/gld_nft/interfaces/gld_nft.js'
import { useTokenData } from '../context/TokenDataContext'
import { convertTokenId } from '../utils/metadataUtils.js'

interface MetadataResponse {
  custom_properties: Record<string, string>
  display_name: string
  description: string
  weight: string
  imageUrl: string
  tokenId: string
}

const getTextValue = (value: Value | undefined): string | null => {
  if (value && 'Text' in value) {
    return value.Text
  }
  return null
}

const fetchNFTMetadata = async (
  canisterId: string,
  nftId: string | bigint,
): Promise<MetadataResponse> => {
  const agent = new HttpAgent({ host: 'https://ic0.app' })
  const actor = Actor.createActor<_GOLD_NFT_SERVICE>(goldIdlFactory, {
    agent,
    canisterId,
  })

  const convertedTokenId = await convertTokenId(nftId, actor)
  const nftResult = await actor.icrc7_token_metadata([convertedTokenId as bigint])

  let metadataText = '{}'

  for (const block of nftResult) {
    if (Array.isArray(block) && block.length > 0) {
      const [entries] = block
      if (Array.isArray(entries)) {
        for (const [key, value] of entries) {
          if (key === 'com.origyn.nft.metadata.json') {
            const text = getTextValue(value)
            if (text) {
              metadataText = text
              break
            }
          }
        }
      }
    }
    if (metadataText !== '{}') break
  }

  const metadata = JSON.parse(metadataText)

  const customProperties = metadata?.__apps?.[0]?.data?.custom_properties || {}
  const displayName = metadata?.__apps?.[0]?.data?.display_name || 'NFT'
  const description = metadata?.__apps?.[0]?.data?.description || ''
  const imageUrl = metadata?.preview_asset
    ? `https://prptl.io/-/${canisterId}/-/${nftId}/preview`
    : '/default_image.png'
  const weight = metadata?.__apps?.[1]?.data?.weight || 'N/A'
  const tokenId = metadata.id || nftId.toString()

  return {
    custom_properties: customProperties,
    display_name: displayName,
    description,
    weight,
    imageUrl,
    tokenId,
  }
}

export const useGetNFTMetadata = (canisterId: string, nftId: string | bigint) => {
  return useQuery<MetadataResponse, Error>({
    queryKey: ['getNFTMetadata', canisterId, nftId],
    queryFn: () => fetchNFTMetadata(canisterId, nftId),
    enabled: !!canisterId && !!nftId,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
