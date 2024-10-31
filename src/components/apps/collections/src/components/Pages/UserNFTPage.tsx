import React, { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../NavBar/NavBar'
import { NFT } from '../../types/global'
import Banner from '../Utils/Banner'
import { useGetNFTDetails } from '../../hooks/useGetNFTDetails'
import OpenASaleModal from '../Modals/OpenASaleModal'
import { useCancelNFTSale } from '../../hooks/useCancelNFTSale'
import { useQueryClient } from '@tanstack/react-query'
import Toast from '../Utils/Toast'
import ConnectWallet from '../Buttons/ConnectWallet'
import { useTokenData } from '../../context/TokenDataContext'
import { useUserProfile } from '../../context/UserProfileContext'

const ArrowIcon: React.FC = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='size-5 mr-2 group-hover:-translate-x-1 duration-300 ease-in-out transition-all'
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18' />
  </svg>
)

const Header: React.FC<{ canisterId: string }> = React.memo(({ canisterId }) => (
  <div className='flex flex-col md:flex-row mt-44 md:mt-16 pb-8 px-8 items-center border-b border-mouse md:ml-[88px]'>
    <div className='flex flex-col gap-2'>
      <p className='text-[#222526] text-[40px] font-bold leading-normal'>NFT Details</p>
      <Link to={`/profile`}>
        <div className='text-[#212425] text-[10px] font-medium leading-[16px] tracking-[2px] uppercase flex flex-row items-center group'>
          <ArrowIcon />
          Profile
        </div>
      </Link>
    </div>
    <div className='md:ml-auto mt-5 md:mt-0'>
      <ConnectWallet />
    </div>
  </div>
))

const ImageContainer: React.FC<{ nft: NFT }> = React.memo(({ nft }) => {
  const { isImageLoading, isImageError, handleImageLoad, handleImageError } = useImageLoader()

  return (
    <div className='xl:w-[562px] xl:h-[564px] relative'>
      {isImageLoading && !isImageError && <SkeletonImage />}
      {isImageError ? (
        <ErrorImage />
      ) : (
        <img
          className={`rounded-tl-2xl rounded-bl-2xl object-contain w-full h-full ${
            isImageLoading ? 'hidden' : 'block'
          }`}
          src={nft.image || 'https://via.placeholder.com/562x564'}
          alt={nft.name || 'NFT Image'}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  )
})

const SkeletonImage: React.FC = () => (
  <div className='absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-tl-2xl rounded-bl-2xl'>
    <div className='xl:w-[562px] xl:h-[564px] bg-gray-300 rounded-[20px]' />
  </div>
)

const ErrorImage: React.FC = () => (
  <div className='flex items-center justify-center h-full italic bg-gray-200 rounded-tl-2xl rounded-bl-2xl'>
    <p>Error loading image</p>
  </div>
)

const PriceSection: React.FC<{ nft: NFT; onBuyNowClick: () => void }> = React.memo(
  ({ nft, onBuyNowClick }) => {
    const { getLogo } = useTokenData()
    const { userProfile } = useUserProfile()

    return (
      <div className='p-4 md:px-8 py-6 md:py-4 bg-white rounded-2xl border border-[#e1e1e1] flex-col w-full'>
        <div className='text-[#2E2E2E] text-base font-bold'>
          {nft.saleDetails?.isSaleOpen ? 'Current price' : 'Last sale price'}
        </div>
        <div className='flex flex-row justify-start items-center gap-2'>
          <img src={getLogo(nft.currency)} alt='Token Logo' className='w-10 h-10' />
          <div className='flex flex-row gap-2 items-baseline'>
            <div className='text-black text-[18px] md:text-[28px] font-bold'>
              {nft.price > 0 && `${nft.price} ${nft.currency}`}
            </div>
            {nft.priceUSD > 0 && (
              <div className='text-[#6e6d66] text-sm font-light'>(${nft.priceUSD})</div>
            )}
          </div>
        </div>
      </div>
    )
  },
)

const NFTDetails: React.FC<{ nft: NFT; onBuyNowClick: () => void }> = React.memo(
  ({ nft, onBuyNowClick }) => (
    <>
      <div className='flex-col justify-start items-start gap-2 flex w-full'>
        <NFTHeader nft={nft} />
      </div>
      <PriceSection nft={nft} onBuyNowClick={onBuyNowClick} />
    </>
  ),
)

const NFTHeader: React.FC<{ nft: NFT }> = ({ nft }) => (
  <>
    <div className='gap-0.5 text-[#69737c] text-[10px] font-medium uppercase leading-[18px] tracking-widest'>
      {nft.collectionName || 'Collection Name'}
    </div>
    <div className='text-[#262c2e] text-[40px] font-bold'>{nft.name || 'NFT Name'}</div>
  </>
)

const useImageLoader = () => {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isImageError, setIsImageError] = useState(false)

  const handleImageLoad = useCallback(() => setIsImageLoading(false), [])
  const handleImageError = useCallback(() => {
    setIsImageLoading(false)
    setIsImageError(true)
  }, [])

  return { isImageLoading, isImageError, handleImageLoad, handleImageError }
}

const UserNFTPageSkeleton: React.FC = () => (
  <div className='flex flex-row bg-white rounded-2xl mx-auto border border-[#e1e1e1] xl:max-w-5xl 4xl:max-w-7xl min-w-[1128px]'>
    <div className='w-[562px] h-[564px] bg-gray-200 animate-pulse rounded-tl-2xl rounded-bl-2xl'></div>
    <div className='flex flex-col justify-center items-start gap-4 mx-10 w-[562px] h-[564px]'>
      <div className='w-full h-6 bg-gray-200 animate-pulse rounded-md mb-2'></div>
      <div className='w-3/4 h-8 bg-gray-200 animate-pulse rounded-md mb-4'></div>
      <div className='w-full flex flex-col mt-4 gap-2'>
        <div className='w-20 h-6 bg-gray-200 animate-pulse rounded-md'></div>
        <div className='flex flex-row items-center gap-2'>
          <div className='w-10 h-10 bg-gray-200 animate-pulse rounded-full'></div>
          <div className='w-32 h-8 bg-gray-200 animate-pulse rounded-md'></div>
        </div>
      </div>
      <div className='w-full h-12 bg-gray-300 animate-pulse rounded-full mt-4'></div>
    </div>
  </div>
)

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className='flex items-center justify-center px-6 py-4 text-red-700 rounded-2xl'>
    <p>An error occurred while fetching NFT details: {message}</p>
  </div>
)

const UserNFTPage: React.FC = () => {
  const urlParts = useMemo(() => window.location.hash.split('/'), [])
  const canisterId = urlParts[2] || ''
  const NFTid = urlParts[3] || ''
  const { data: nft, isLoading, error, isFetching } = useGetNFTDetails(canisterId, NFTid)
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoadingAction, setIsLoadingAction] = useState(false)
  const { mutate: cancelSale } = useCancelNFTSale()
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details')

  console.log(nft)

  const handleOpenSaleModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleCancelSale = useCallback(
    (tokenId: string) => {
      console.log('tokenId', tokenId)
      console.log('nftId', tokenId)
      if (tokenId && tokenId) {
        setIsLoadingAction(true)
        cancelSale(
          { tokenId },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['getNFTDetails'] })
              setMessage('Sale cancelled successfully')
              setShowToast(true)
              setIsLoadingAction(false)
            },
            onError: (error: any) => {
              console.error('Error cancelling the sale:', error)
              setMessage(error.message)
              setShowToast(true)
              setIsLoadingAction(false)
            },
          },
        )
      }
    },
    [cancelSale, queryClient],
  )

  const handleCloseModal = useCallback(() => setIsModalOpen(false), [])

  return (
    <div className='bg-gradient-to-t from-[#ebebeb] to-[#f9f9f9] flex flex-col min-h-screen'>
      <Banner collectionName={nft?.collectionName || 'Unknown'} />
      <div className='flex flex-row flex-grow'>
        <NavBar />
        <div className='flex flex-col items-center w-full'>
          <div className='w-full'>
            <Header canisterId={canisterId} />
            <div className='xl:mt-10 flex flex-col'>
              {error && <ErrorMessage message={error.message} />}
              <div className='flex flex-col w-11/12 mx-auto md:w-10/12 md:pb-0 md:ml-28 mt-8 xl:ml-28 2xl:mx-auto xl:flex-row bg-white rounded-2xl border border-[#e1e1e1] xl:max-w-5xl 4xl:max-w-7xl xl:min-w-[1128px] xl:min-h-[564px]'>
                {isLoading || isFetching ? (
                  <UserNFTPageSkeleton />
                ) : (
                  nft && (
                    <>
                      <ImageContainer nft={nft} />
                      <div className='flex-col justify-center items-center gap-8 inline-flex px-6 md:mx-10 xl:w-[562px] xl:h-[564px]'>
                        <NFTDetails nft={nft} onBuyNowClick={handleOpenSaleModal} />
                        {nft.saleDetails?.saleId && nft.price > 0 && nft.saleDetails.isSaleOpen ? (
                          <>
                            <div className='w-full h-20 px-8 py-4 bg-white rounded-2xl border border-[#e1e1e1] justify-start items-start gap-2.5 inline-flex'>
                              <button
                                className='bg-[#212425] rounded-full justify-center items-center w-full'
                                onClick={() => handleCancelSale(nft.id)}
                                disabled={isLoadingAction}
                              >
                                <p className='text-center text-white text-sm font-semibold leading-[48px]'>
                                  {isLoadingAction ? 'Canceling...' : 'Cancel listing'}
                                </p>
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className='w-full h-20 px-8 py-4 bg-white rounded-2xl border border-[#e1e1e1] justify-start items-start gap-2.5 inline-flex'>
                            <button
                              className='bg-[#212425] rounded-full justify-center items-center w-full'
                              onClick={() => handleOpenSaleModal()}
                              disabled={isLoadingAction}
                            >
                              <p className='text-center text-white text-sm font-semibold leading-[48px]'>
                                {isLoadingAction ? 'Listing...' : 'List item'}
                              </p>
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )
                )}
              </div>
              {/* Tabs section */}
              <div className='flex justify-center items-center w-11/12 mx-auto md:w-10/12 mt-8'>
                <div className='flex gap-10'>
                  <button
                    className={`text-[10px] font-medium uppercase tracking-widest pb-2 ${
                      activeTab === 'details'
                        ? 'font-bold text-[#262c2e] underline underline-offset-4'
                        : 'text-[#69737c]'
                    }`}
                    onClick={() => setActiveTab('details')}
                  >
                    Details
                  </button>
                  <button
                    className={`text-[10px] font-medium uppercase tracking-widest pb-2 ${
                      activeTab === 'activity'
                        ? 'font-bold text-[#262c2e] underline underline-offset-4'
                        : 'text-[#69737c]'
                    }`}
                    onClick={() => setActiveTab('activity')}
                  >
                    Activity
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && nft && <OpenASaleModal selectedNFT={nft} onClose={handleCloseModal} />}
      {showToast && <Toast message={message} onClose={() => setShowToast(false)} />}
    </div>
  )
}

export default React.memo(UserNFTPage)
