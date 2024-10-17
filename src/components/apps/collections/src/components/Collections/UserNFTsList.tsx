// UserNFTsList.tsx

import React, { useCallback, useEffect, useState } from 'react'
import { NFT } from '../../types/global'
import Pagination from '../Pagination/Pagination'
import { useUserProfile } from '../../context/UserProfileContext'
import { Principal } from '@dfinity/principal'
import Loader from '../Utils/Loader'
import { useUserNFTs } from '../../hooks/useGetUserNFTs'
import VerifiedIcon from '../../assets/icons/VerifiedIcon'
import OpenASaleModal from '../Modals/OpenASaleModal'

const UserNFTsList: React.FC = () => {
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [isOpenASaleModalOpen, setisOpenASaleModalOpen] = useState(false)
  const [salePrice, setSalePrice] = useState('')

  const { userProfile } = useUserProfile()

  let userPrincipal: Principal | undefined
  try {
    userPrincipal = userProfile ? Principal.fromText(userProfile.walletAddress) : undefined
  } catch (e) {
    console.error('Invalid wallet address:', e)
    userPrincipal = undefined
  }

  const { data: nfts, isLoading, isError, error } = useUserNFTs(userPrincipal)

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth <= 640 ? 4 : 8)
    }

    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  const filteredNfts = nfts?.filter(nft => nft.name && nft.name.trim() !== '') || []

  const indexOfLastNFT = currentPage * itemsPerPage
  const indexOfFirstNFT = indexOfLastNFT - itemsPerPage
  const currentNFTs = filteredNfts.slice(indexOfFirstNFT, indexOfLastNFT)
  const totalPages = Math.ceil(filteredNfts.length / itemsPerPage)

  const openSaleModal = useCallback((nft: NFT) => {
    setSelectedNFT(nft)
    setisOpenASaleModalOpen(true)
  }, [])

  const closeOpenASaleModal = () => {
    setisOpenASaleModalOpen(false)
    setSalePrice('')
  }

  const NFTCard: React.FC<{ nft: NFT }> = React.memo(({ nft }) => (
    <div className='bg-white rounded-2xl border border-gray-300 flex flex-col group relative overflow-hidden'>
      <div className='rounded-t-2xl overflow-hidden'>
        <img
          className='w-full max-h-[243px] object-contain hover:scale-110 duration-300 ease-in-out transition-transform'
          src={nft.image}
          alt={nft.name}
        />
      </div>
      <div className='p-4 flex flex-col justify-between flex-grow'>
        <h3 className='text-[10px] font-medium leading-[18px] tracking-[2px] text-[#69737C] uppercase'>
          <span className='flex flex-row items-center gap-1'>
            {nft.categoryName || 'Unknown'} <VerifiedIcon />
          </span>
        </h3>
        <h3 className='text-gray-900 text-base font-bold'>{nft.name}</h3>

        {nft.saleDetails && nft.price > 0 ? (
          <div className='mt-2'>
            <span className='px-4 py-2 mt-2 bg-gray-900 text-white text-xs font-bold rounded-full'>
              {`${nft.price} ${nft.currency}`}
            </span>
          </div>
        ) : (
          <button className='mt-2 hover:opacity-80 mr-auto' onClick={() => openSaleModal(nft)}>
            <span className='px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-full'>
              Open a sale
            </span>
          </button>
        )}
      </div>
    </div>
  ))

  const NFTSkeleton: React.FC = () => (
    <div className='bg-white rounded-2xl border border-gray-300 flex flex-col animate-pulse'>
      <div className='h-56 rounded-t-2xl overflow-hidden bg-gray-300'></div>
      <div className='p-4 flex flex-col justify-between flex-grow'>
        <div className='h-6 bg-gray-300 rounded w-3/4'></div>
        <div className='mt-2'>
          <span className='px-8 py-1 bg-gray-300 text-white text-xs font-bold rounded-full'>
            &nbsp;
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className='px-6 md:px-20 w-full flex flex-col items-center my-10'>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-6 w-full'>
          {isLoading
            ? Array.from({ length: itemsPerPage }, (_, index) => <NFTSkeleton key={index} />)
            : currentNFTs.map(nft => <NFTCard key={nft.id} nft={nft} />)}
        </div>
        {!isLoading && !isError && filteredNfts && filteredNfts.length === 0 && (
          <p className='text-center text-[#69737c] italic font-medium mb-4 px-6'>
            No NFTs available in your collection
          </p>
        )}
        {error && (
          <p className='text-center text-[#69737c] italic font-medium mb-4 px-6'>
            Error loading your NFTs: {error?.message || 'Please try again later.'}
          </p>
        )}
        {!isLoading && !isError && nfts && (
          <div className='flex justify-center md:justify-end items-center mt-4 w-full'>
            {totalPages > 1 && (
              <Pagination
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                currentPage={currentPage}
                paginate={setCurrentPage}
              />
            )}
          </div>
        )}
        {isOpenASaleModalOpen && selectedNFT && (
          <OpenASaleModal selectedNFT={selectedNFT} onClose={closeOpenASaleModal} />
        )}
      </div>
    </>
  )
}

export default UserNFTsList
