import React from 'react'
import { NFT } from '../../types/global'

const NFTDetailsContent: React.FC<{ nft: NFT }> = ({ nft }) => (
  <section className='bg-white rounded-2xl md:px-12 px-6 pt-6 md:pt-12 mb-14 mx-auto border border-[#e1e1e1] xl:max-w-5xl 4xl:max-w-7xl xl:min-w-[1128px] md:ml-28 w-11/12 xl:mx-auto'>
    {/* Title and Header */}
    <header className='flex flex-col md:flex-row center justify-center md:justify-between items-center mb-4 md:mb-8'>
      <div>
        <h1 className='text-3xl font-bold text-center'>Certificate</h1>
        <p className='text-lg text-gray-500 text-center md:text-left'>
          1g Gold Bullion Bar Origyn Digital Certificate
        </p>
      </div>
      <div className='text-center md:text-right'>
        <p className='text-3xl font-bold'>1g</p>
        <p className='text-sm text-gray-500'>{nft.id || '012838'}</p>
      </div>
    </header>

    {/* Content Sections */}
    <section className='flex flex-col md:flex-row justify-between items-start'>
      {/* Gold Specifications */}
      <div className='grid grid-cols-2 gap-4 text-center text-gray-700 mb-8 p-4 md:w-1/2'>
        <div className='border border-[#e1e1e1] p-4 rounded-xl hover:bg-gray-100'>
          <p className='font-semibold text-lg'>99.99%</p>
          <p className='text-xs text-gray-500'>Fineness</p>
        </div>
        <div className='border border-[#e1e1e1] p-4 rounded-xl hover:bg-gray-100'>
          <p className='font-semibold text-lg'>8.7 x 15 mm</p>
          <p className='text-xs text-gray-500'>Dimensions</p>
        </div>
        <div className='border border-[#e1e1e1] p-4 rounded-xl hover:bg-gray-100'>
          <p className='font-semibold text-lg'>1g</p>
          <p className='text-xs text-gray-500'>Weight</p>
        </div>
        <div className='border border-[#e1e1e1] p-4 rounded-xl hover:bg-gray-100'>
          <p className='font-semibold text-lg'>25 Hv</p>
          <p className='text-xs text-gray-500'>Hardness</p>
        </div>
        <div className='border border-[#e1e1e1] p-4 rounded-xl hover:bg-gray-100'>
          <p className='font-semibold text-lg'>{'013011'}</p>
          <p className='text-xs text-gray-500'>Serial Number</p>
        </div>
        <div className='border border-[#e1e1e1] p-4 rounded-xl hover:bg-gray-100'>
          <p className='font-semibold text-lg'>METALOR</p>
          <p className='text-xs text-gray-500'>Gold Manufacturer</p>
        </div>
      </div>

      {/* NFT Image */}
      <div className='w-3/4 md:w-1/3 mx-auto'>
        <img src={nft.image} alt='Gold Bar' className='object-cover md:h-1/2 md:w-3/4' />
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

export default NFTDetailsContent
