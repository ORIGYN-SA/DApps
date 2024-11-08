import { useGetNFTMetadata } from '@dapp/common-hooks'
import React from 'react'

interface NFTMetadataContentProps {
  canisterId: string
  nftId: string | bigint
}
const NFTMetadataSkeleton: React.FC = () => {
  return (
    <section className='bg-white rounded-2xl md:px-12 px-6 pt-6 md:pt-12 mb-14 mx-auto border border-[#e1e1e1] xl:max-w-5xl 4xl:max-w-7xl xl:min-w-[1128px] md:ml-28 w-11/12 xl:mx-auto'>
      <header className='flex flex-col md:flex-row center justify-center md:justify-between items-center mb-4 md:mb-8'>
        <div>
          <div className='h-8 w-40 bg-gray-300 rounded-md animate-pulse mb-2'></div>
          <div className='h-4 w-64 bg-gray-200 rounded-md animate-pulse'></div>
        </div>
        <div className='text-center md:text-right'>
          <div className='h-8 w-24 bg-gray-300 rounded-md animate-pulse mb-2'></div>
          <div className='h-4 w-32 bg-gray-200 rounded-md animate-pulse'></div>
        </div>
      </header>

      <section className='flex flex-col md:flex-row justify-between items-start'>
        <div className='grid grid-cols-2 gap-4 text-center text-gray-700 mb-8 p-4 md:w-1/2'>
          {[...Array(4)].map((_, index) => (
            <div key={index} className='border border-[#e1e1e1] p-4 rounded-xl'>
              <div className='h-6 w-16 bg-gray-300 rounded-md animate-pulse mb-2'></div>
              <div className='h-4 w-12 bg-gray-200 rounded-md animate-pulse'></div>
            </div>
          ))}
        </div>

        <div className='w-3/4 md:w-1/3 mx-auto h-80 mb-10'>
          <div className='h-full bg-gray-300 rounded-md animate-pulse'></div>
        </div>

        <div className='flex flex-col items-center text-center self-center mb-8 md:mb-0'>
          <div className='w-24 h-24 bg-gray-300 rounded-full animate-pulse mb-2'></div>
          <div className='h-4 w-32 bg-gray-200 rounded-md animate-pulse'></div>
        </div>
      </section>
    </section>
  )
}

const NFTMetadataContent: React.FC<NFTMetadataContentProps> = ({ canisterId, nftId }) => {
  const { data: nft, isLoading, isError, isFetching } = useGetNFTMetadata(canisterId, nftId)

  if (isLoading || isFetching) return <NFTMetadataSkeleton />
  if (isError || !nft) return <p>Error loading NFT Details.</p>

  return (
    <section
      className='bg-white rounded-2xl md:px-12 px-6 w-11/12 pt-6 md:pt-12 mb-14 mx-auto border border-[#e1e1e1] xl:max-w-5xl 4xl:max-w-7xl xl:min-w-[1128px] md:ml-28 xl:mx-auto
    md:w-10/12 md:pb-0 mt-8 xl:ml-28 2xl:mx-auto xl:flex-row xl:min-h-[564px]'
    >
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
