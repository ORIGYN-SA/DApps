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
import { useAuth } from '../../auth/hooks'
import ErrorMessage from '../UserNFTPage/ErrorMessage'
import NFTActivityContent from '../UserNFTPage/NFTActivityContent'
import NFTMetadataContent from '../UserNFTPage/NFTMetadataContent'
import UserNFTPageSkeleton from '../UserNFTPage/Skeletons/UserNFTPageSkeleton'
import NFTTransferModal from '../Modals/NFTTransferModal'
import VerifiedIcon from '../../assets/icons/VerifiedIcon'

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
  <div className='flex flex-col md:flex-row mt-44 md:mt-16 pb-8 md:px-8 items-center border-b border-mouse md:ml-[88px]'>
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
          src={nft.image || 'https://placehold.co/562x564'}
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
      {nft.saleDetails && <PriceSection nft={nft} onBuyNowClick={onBuyNowClick} />}
    </>
  ),
)

const NFTHeader: React.FC<{ nft: NFT }> = ({ nft }) => (
  <>
    <div className=' text-[#69737c] text-[10px] font-medium uppercase leading-[18px] tracking-widest'>
      <span className='flex flex-row items-center gap-1'>
        {nft.categoryName || 'Unknown'} <VerifiedIcon />
      </span>
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

const UserNFTPage: React.FC = () => {
  const urlParts = useMemo(() => window.location.hash.split('/'), [])
  const canisterId = urlParts[2] || ''
  const NFTid = urlParts[3] || ''
  const { data: nft, isLoading, error, isFetching } = useGetNFTDetails(canisterId, NFTid)
  const queryClient = useQueryClient()
  const [modalType, setModalType] = useState<'sale' | 'transfer' | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoadingAction, setIsLoadingAction] = useState(false)
  const { mutate: cancelSale } = useCancelNFTSale()
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details')

  const { isConnected } = useAuth()
  const { userProfile } = useUserProfile()

  const handleCancelSale = useCallback(
    (tokenId: string) => {
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

  const handleOpenSaleModal = useCallback(() => {
    setModalType('sale')
    setIsModalOpen(true)
  }, [])

  const handleTransferModal = useCallback(() => {
    setModalType('transfer')
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setModalType(null)
  }, [])

  const isMyNFT = nft?.owner === userProfile?.walletAddress

  return (
    <div className='relative'>
      {!isConnected && !userProfile && (
        <div className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm z-50'>
          <p className='text-lg text-gray-700 mb-4 w-3/4 text-center xl:w-full'>
            Please press the "Connexion" button below to access your profile.
          </p>
          <ConnectWallet />
          <Link to='/profile' className='hover:underline pt-4 '>
            Back to Profile
          </Link>
        </div>
      )}
      <div className='bg-gradient-to-t from-[#ebebeb] to-[#f9f9f9] flex flex-col min-h-screen'>
        <Banner collectionName={nft?.categoryName || 'Unknown'} />
        <div className='flex flex-row flex-grow'>
          <NavBar />
          <div className='flex flex-col items-center w-full'>
            <div className='w-full'>
              <Header canisterId={canisterId} />
              <div className='xl:mt-10 flex flex-col'>
                {error && <ErrorMessage message={error.message} />}
                <div className='flex flex-col w-11/12 mx-auto md:w-10/12 md:pb-0 md:ml-28 mt-8 xl:ml-28 2xl:mx-auto xl:flex-row bg-white rounded-2xl border border-[#e1e1e1] xl:max-w-5xl 4xl:max-w-7xl xl:min-w-[1128px] xl:min-h-[564px]'>
                  {isLoading || isFetching || !userProfile || !nft ? (
                    <UserNFTPageSkeleton />
                  ) : (
                    nft && (
                      <>
                        <ImageContainer nft={nft} />
                        <div className='flex-col justify-center items-center gap-6 mb-6 xl:mb-0 inline-flex px-6 md:mx-10 xl:w-[562px] xl:h-[564px]'>
                          <NFTDetails nft={nft} onBuyNowClick={handleOpenSaleModal} />
                          {nft.saleDetails?.saleId &&
                          nft.price > 0 &&
                          nft.saleDetails.isSaleOpen ? (
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
                          ) : isMyNFT ? (
                            <div className='w-full h-20 px-8 py-4 bg-white rounded-2xl border border-[#e1e1e1] justify-start items-start gap-2.5 inline-flex'>
                              <button
                                className='bg-[#212425] rounded-full justify-center hover:scale-105 duration-200 transition-all ease-in-out items-center w-full'
                                onClick={() => handleOpenSaleModal()}
                                disabled={isLoadingAction}
                              >
                                <p className='text-center text-white text-sm font-semibold leading-[48px]'>
                                  {isLoadingAction ? 'Opening...' : 'Open a sale'}
                                </p>
                              </button>
                              <button
                                className='bg-[#212425] rounded-full hover:scale-105 duration-200 transition-all ease-in-out justify-center items-center w-full'
                                onClick={() => handleTransferModal()}
                                disabled={isLoadingAction}
                              >
                                <p className='text-center text-white text-sm font-semibold leading-[48px]'>
                                  {isLoadingAction ? 'Transferring...' : 'Transfer'}
                                </p>
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </>
                    )
                  )}
                </div>
                {nft && (
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
                )}
                {isConnected && (
                  <div className=' mt-4'>
                    {activeTab === 'details' && nft && (
                      <NFTMetadataContent canisterId={canisterId} nftId={nft.id} />
                    )}
                    {activeTab === 'activity' && nft && <NFTActivityContent nft={nft} />}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {isModalOpen && nft && modalType === 'sale' && (
          <OpenASaleModal selectedNFT={nft} onClose={handleCloseModal} />
        )}
        {isModalOpen && nft && modalType === 'transfer' && (
          <NFTTransferModal selectedNFT={nft} onClose={handleCloseModal} canisterId={canisterId} />
        )}
        {showToast && <Toast message={message} onClose={() => setShowToast(false)} />}
      </div>
    </div>
  )
}

export default React.memo(UserNFTPage)
