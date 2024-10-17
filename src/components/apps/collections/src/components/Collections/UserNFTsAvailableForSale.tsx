// UserNFTsAvailableForSale.tsx

import React, { useEffect, useState } from 'react'
import { NFT } from '../../types/global'
import Pagination from '../Pagination/Pagination'
import { useUserProfile } from '../../context/UserProfileContext'
import { Principal } from '@dfinity/principal'
import Loader from '../Utils/Loader'
import { useUserNFTs } from '../../hooks/useGetUserNFTs'

interface UserNFTsAvailableForSaleProps {
  selectedNFT: NFT | null
  handleSelectNFT: (nft: NFT) => void
}

const UserNFTsAvailableForSale: React.FC<UserNFTsAvailableForSaleProps> = ({
  selectedNFT,
  handleSelectNFT,
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [currentPage, setCurrentPage] = useState(1)

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

  const filteredNfts =
    nfts?.filter(nft => nft.name && nft.name.trim() !== '' && !nft.saleDetails) || []

  const indexOfLastNFT = currentPage * itemsPerPage
  const indexOfFirstNFT = indexOfLastNFT - itemsPerPage
  const currentNFTs = filteredNfts.slice(indexOfFirstNFT, indexOfLastNFT)
  const totalPages = Math.ceil(filteredNfts.length / itemsPerPage)

  return (
    <>
      <div className='flex flex-col justify-center w-full items-center'>
        {isLoading && !isError && <Loader size={40} />}
        {isError && (
          <p className='text-center text-[#69737c] italic font-medium mb-4 px-6'>
            Error loading your NFTs: {error?.message || 'Please try again later.'}
          </p>
        )}
      </div>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full px-6 md:px-5'>
        {!isLoading &&
          !isError &&
          currentNFTs.length > 0 &&
          currentNFTs.map(nft => (
            <div
              key={nft.id}
              className={`block cursor-pointer border rounded-2xl bg-white transition duration-300 relative ${
                selectedNFT?.id === nft.id ? 'border-[#33B9FF] border-2' : 'border-gray-300'
              }`}
              onClick={() => {
                if (!nft.saleDetails) {
                  handleSelectNFT(nft)
                }
              }}
            >
              <div className='flex p-2 items-center gap-4'>
                <img
                  src={nft.image || 'https://via.placeholder.com/243'}
                  alt={nft.name || 'NFT Image'}
                  className='h-28 w-28 rounded-2xl object-contain'
                />
                <div className='w-1/2'>
                  <h3 className='text-[#69737C] font-medium text-[10px] leading-[18px] tracking-[2px] uppercase'>
                    {nft.categoryName || 'Unknown'}
                  </h3>
                  <p className='text-[16px] font-bold leading-normal'>{nft.name || 'Unknown'}</p>
                </div>
              </div>
              {nft.saleDetails && (
                <div className='bg-charcoal text-center text-white text-[12px] w-1/2 italic font-medium absolute top-0 right-0 p-1 rounded-tr-2xl rounded-bl-xl'>
                  NFT on sale
                </div>
              )}
              {nft.saleDetails && (
                <div className='bg-charcoal text-center text-white text-[12px] w-fit px-6 italic font-medium absolute bottom-0 right-0 p-1 rounded-br-2xl rounded-tl-xl'>
                  Price: {nft.saleDetails.buyNow.amount} {nft.saleDetails.currency}
                </div>
              )}
            </div>
          ))}
      </div>
      {!isLoading && !isError && filteredNfts.length === 0 && (
        <p className='text-center text-[#69737c] italic font-medium mb-4 px-6'>
          No NFTs available in your collection for listing
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
    </>
  )
}

export default UserNFTsAvailableForSale
