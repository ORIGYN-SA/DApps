import React from 'react'
import { useGetNFTDetails } from '../../hooks/useGetNFTDetails'
import { useGetNFTMetadata } from '../../hooks/useGetNFTMetadata'

interface NFTMetadataContentProps {
  canisterId: string
  nftId: string | bigint
}

const NFTMetadataContent: React.FC<NFTMetadataContentProps> = ({ canisterId, nftId }) => {
  const { data: nft, isLoading, isError } = useGetNFTMetadata(canisterId, nftId)
  console.log('nft', nft)

  if (isLoading) return <p>Loading NFT Details...</p>
  if (isError || !nft) return <p>Error loading NFT Details.</p>

  return (
    <section className='bg-white rounded-2xl md:px-12 px-6 pt-6 md:pt-12 mb-14 mx-auto border border-[#e1e1e1] xl:max-w-5xl 4xl:max-w-7xl xl:min-w-[1128px] md:ml-28 w-11/12 xl:mx-auto'>
      {/* Title and Header */}
      <header className='flex flex-col md:flex-row center justify-center md:justify-between items-center mb-4 md:mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-center'>{nft.display_name}</h1>
          <p className='text-lg text-gray-500 text-center md:text-left'>{nft.description}</p>
        </div>
        <div className='text-center md:text-right'>
          {nft.custom_properties.Weight && (
            <p className='text-3xl font-bold'>{nft.custom_properties.Weight}</p>
          )}
          <p className='text-sm text-gray-500'>{nft.tokenId}</p>
        </div>
      </header>

      {/* Content Sections */}
      <section className='flex flex-col md:flex-row justify-between items-start'>
        {/* NFT Specifications */}
        <div className='grid grid-cols-2 gap-4 text-center text-gray-700 mb-8 p-4 md:w-1/2'>
          {Object.entries(nft.custom_properties).map(([key, value]) => (
            <div key={key} className='border border-[#e1e1e1] p-4 rounded-xl hover:bg-gray-100'>
              <p className='font-semibold text-lg'>{value}</p>
              <p className='text-xs text-gray-500'>{key}</p>
            </div>
          ))}
        </div>

        {/* NFT Image */}
        <div className='w-3/4 md:w-1/3 mx-auto'>
          <img
            src={nft.imageUrl}
            alt={nft.display_name}
            className='object-cover md:h-1/2 md:w-3/4'
          />
        </div>

        {/* NFT Linked Asset */}
        <div className='flex flex-col items-center text-center self-center mb-8 md:mb-0'>
          <img
            src='/public/assets/OGY_Certificate.png'
            alt='Origyn Logo'
            className='w-24 h-24 mb-2'
          />
          <p className='text-xs text-gray-500'>NFT Linked Asset</p>
        </div>
      </section>
    </section>
  )
}

export default NFTMetadataContent
