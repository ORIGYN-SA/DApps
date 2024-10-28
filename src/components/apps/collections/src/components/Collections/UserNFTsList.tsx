import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { NFT } from '../../types/global'
import Pagination from '../Pagination/Pagination'
import { useUserProfile } from '../../context/UserProfileContext'
import { Principal } from '@dfinity/principal'
import Loader from '../Utils/Loader'
import { useUserNFTs } from '../../hooks/useGetUserNFTs'
import VerifiedIcon from '../../assets/icons/VerifiedIcon'
import OpenASaleModal from '../Modals/OpenASaleModal'
import { useCancelNFTSale } from '../../hooks/useCancelNFTSale'
import { useQueryClient } from '@tanstack/react-query'
import Toast from '../Utils/Toast'

interface UserNFTsListProps {
  nfts: NFT[]
  isLoading: boolean
  isError: boolean
  isFetching: boolean
}

const UserNFTsList = ({ nfts, isLoading, isError, isFetching }: UserNFTsListProps) => {
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [isOpenASaleModalOpen, setisOpenASaleModalOpen] = useState(false)
  const [salePrice, setSalePrice] = useState('')
  const [message, setMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [isLoadingAction, setIsLoadingAction] = useState(false)
  const [selectedNFTId, setSelectedNFTId] = useState<string | null>(null)

  const { mutate: cancelSale } = useCancelNFTSale()
  const queryClient = useQueryClient()

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth <= 640 ? 4 : 8)
    }

    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  const filteredNfts = useMemo(
    () => nfts?.filter(nft => nft.name && nft.name.trim() !== '') || [],
    [nfts],
  )

  const indexOfLastNFT = currentPage * itemsPerPage
  const indexOfFirstNFT = indexOfLastNFT - itemsPerPage
  const currentNFTs = useMemo(
    () => filteredNfts.slice(indexOfFirstNFT, indexOfLastNFT),
    [filteredNfts, indexOfFirstNFT, indexOfLastNFT],
  )
  const totalPages = Math.ceil(filteredNfts.length / itemsPerPage)

  console.log('currentNFTs', currentNFTs)

  const openSaleModal = useCallback((nft: NFT) => {
    setSelectedNFTId(nft.id)
    setSelectedNFT(nft)
    setisOpenASaleModalOpen(true)
  }, [])

  const closeOpenASaleModal = useCallback(() => {
    setisOpenASaleModalOpen(false)
    setSalePrice('')
  }, [])

  const handleCancelSale = useCallback(
    (saleId: string | null, nftId: string | null) => {
      if (saleId && nftId) {
        setSelectedNFTId(nftId)
        setIsLoadingAction(true)
        cancelSale(
          { saleId },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['userNFTs'] })
              setMessage('Sale cancelled successfully')
              setShowToast(true)
              setIsLoadingAction(false)
            },
            onError: error => {
              console.error('Error cancelling the sale:', error)
              setMessage(error.message)
              setShowToast(true)
              setIsLoadingAction(false)
              setSelectedNFTId(null)
            },
          },
        )
      }
    },
    [cancelSale, queryClient],
  )

  const NFTCard: React.FC<{ nft: NFT }> = React.memo(({ nft }) => {
    const isNFTLoading = isFetching && selectedNFTId === nft.id

    return (
      <div className='bg-white rounded-2xl h-[374px] border border-gray-300 flex flex-col group relative overflow-hidden'>
        {isNFTLoading ? (
          <NFTSkeleton />
        ) : (
          <>
            <div className='rounded-t-2xl overflow-hidden'>
              <img
                className='w-full h-[243px] object-contain hover:scale-110 duration-300 ease-in-out transition-transform'
                src={nft.image}
                alt={nft.name}
              />
            </div>
            <div className='p-4 flex flex-col justify-between flex-grow'>
              <div>
                <h3 className='text-[10px] font-medium leading-[18px] tracking-[2px] text-[#69737C] uppercase'>
                  <span className='flex flex-row items-center gap-1'>
                    {nft.categoryName || 'Unknown'} <VerifiedIcon />
                  </span>
                </h3>
                <h3 className='text-gray-900 text-base font-bold'>{nft.name}</h3>
              </div>

              <div className='mt-auto'>
                {nft.saleDetails && nft.saleDetails.saleId && nft.price > 0 ? (
                  <div className='flex row items-center justify-between'>
                    <div>
                      <span className='px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-full'>
                        {`${nft.price} ${nft.currency}`}
                      </span>
                    </div>
                    <button
                      className='hover:opacity-80 disabled:opacity-50'
                      disabled={isLoadingAction && selectedNFTId === nft.id}
                      onClick={() => handleCancelSale(nft.id || null, nft.id)}
                    >
                      <span className='px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-full'>
                        {isLoadingAction && selectedNFTId === nft.id
                          ? 'Canceling...'
                          : 'Cancel sale'}
                      </span>
                    </button>
                  </div>
                ) : (
                  <button className='hover:opacity-80 mr-auto' onClick={() => openSaleModal(nft)}>
                    <span className='px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-full'>
                      {isLoading && selectedNFTId === nft.id ? 'Opening...' : 'Open a sale'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    )
  })

  const NFTSkeleton: React.FC = () => (
    <div className='bg-white rounded-2xl border border-gray-300 flex flex-col animate-pulse h-[374px]'>
      <div className='h-[243px] rounded-t-2xl overflow-hidden bg-gray-300'></div>
      <div className='p-4 flex flex-col justify-between flex-grow'>
        <div>
          <div className='h-3 bg-gray-300 rounded w-1/2 mb-2'></div>
          <div className='h-4 bg-gray-300 rounded w-3/4'></div>
        </div>

        <div className='mt-auto flex items-center justify-between'>
          <div className='px-10 py-1 bg-gray-300 text-transparent text-xs font-bold rounded-full'>
            &nbsp;
          </div>
          <div className='px-8 py-1 bg-gray-300 text-transparent text-xs font-bold rounded-full'>
            &nbsp;
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className='px-6 md:px-20 w-full flex flex-col items-center my-10'>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-6 w-full'>
        {isLoading
          ? Array.from({ length: itemsPerPage }, (_, index) => <NFTSkeleton key={index} />)
          : currentNFTs.map(nft => <NFTCard key={nft.id} nft={nft} />)}
      </div>
      {!isLoading && !isError && filteredNfts.length === 0 && (
        <p className='text-center text-[#69737c] italic font-medium mb-4 px-6'>
          No NFTs in your collection
        </p>
      )}
      {isError && (
        <p className='text-center text-[#69737c] italic font-medium mb-4 px-6'>
          Error loading your NFTs. Please try again later.
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
      {showToast && <Toast message={message} onClose={() => setShowToast(false)} />}
    </div>
  )
}

export default React.memo(UserNFTsList)
