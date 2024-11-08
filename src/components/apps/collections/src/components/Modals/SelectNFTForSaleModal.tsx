import React from 'react'
import UserNFTsAvailableForSale from '../Collections/UserNFTsAvailableForSale'
import { NFT } from '@dapp/common-types'
import { Loader } from '@dapp/features-components'
import { useUserProfile } from '@dapp/features-userprofile'

interface SelectNFTForSaleModalProps {
  currentNFTs: NFT[]
  selectedNFT: NFT | null
  handleSelectNFT: (nft: NFT) => void
  onClose: () => void
  onConfirm: () => void
}

const SelectNFTForSaleModal: React.FC<SelectNFTForSaleModalProps> = ({
  selectedNFT,
  handleSelectNFT,
  onClose,
  onConfirm,
}) => {
  const { userProfile } = useUserProfile()
  if (!userProfile) {
    return <Loader />
  }

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-[#212425] bg-opacity-70 z-50'
      onClick={handleOutsideClick}
    >
      <div className='bg-white rounded-2xl py-10 md:py-4 3xl:py-8 w-[90%] xl:w-3/4 2xl:w-1/2 3xl:max-w-5xl shadow-lg relative xl:space-y-3 3xl:space-y-6'>
        <button
          className='absolute top-4 right-4 text-gray-400 text-2xl hover:text-gray-600'
          onClick={onClose}
        >
          &times;
        </button>
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <h2 className='text-center text-[#212425] text-[22px] font-semibold'>Select your NFT</h2>
          <p className='text-center text-[#69737c] text-[13px] font-medium px-6'>
            Please select one NFT from the list below to open a sale.
          </p>
          <div className='my-8 px-6'>
            <UserNFTsAvailableForSale selectedNFT={selectedNFT} handleSelectNFT={handleSelectNFT} />
          </div>
          <div className='h-[1px] w-full bg-gray-300 my-4'></div>
          <button
            className={`bg-charcoal w-3/4 md:w-1/2 py-4 mt-2 md:mt-6 rounded-full hover:scale-105 transition-all text-center text-white text-sm font-semibold ${
              !selectedNFT ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            disabled={!selectedNFT}
            onClick={onConfirm}
          >
            {selectedNFT ? 'Set the price of your NFT' : 'Choose your NFT'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SelectNFTForSaleModal
