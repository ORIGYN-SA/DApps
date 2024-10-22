import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../Bar/SearchBar'
import Pagination from '../Pagination/Pagination'
import NavBar from '../NavBar/NavBar'
import { useGetCollectionDetails } from '../../hooks/useGetCollectionDetails'
import { NFT } from '../../types/global'
import Banner from '../Utils/Banner'
import ConnectWallet from '../Buttons/ConnectWallet'
import OpenASale from '../Buttons/OpenASale'
import SelectNFTForSaleModal from '../Modals/SelectNFTForSaleModal'
import OpenASaleModal from '../Modals/OpenASaleModal'
import ItemsPerPage from '../Utils/ItemsPerPage'
import { useAuth } from '../../auth/hooks/useAuth'
import { useUserProfile } from '../../context/UserProfileContext'

const NFTCard: React.FC<{ nft: NFT; canisterId: string }> = ({ nft, canisterId }) => (
  <Link to={`/collection/${canisterId}/${nft.id}`} className='flex flex-col'>
    <div className='bg-white rounded-2xl border border-gray-300 flex flex-col group relative overflow-hidden'>
      <div className='rounded-t-2xl overflow-hidden'>
        <img
          className='w-full h-[243px] object-contain hover:scale-110 duration-300 ease-in-out transition-transform'
          src={nft.image}
          alt={nft.name}
        />
      </div>
      <div className='p-4 flex flex-col justify-between flex-grow'>
        <h3 className='text-[#69737C] font-medium text-[10px] leading-[18px] tracking-[2px] uppercase'>
          {nft.categoryName || 'Unknown'}
        </h3>
        <h3 className='text-gray-900 text-base font-bold'>{nft.name}</h3>
        <div className='mt-2'>
          <span className='px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-full'>
            {nft.price > 0 ? `${nft.price} ${nft.currency}` : 'Not for sale'}
          </span>
        </div>
      </div>
      <div className='opacity-0 absolute bottom-0 left-0 right-0 h-10 bg-charcoal rounded-b-2xl flex items-center justify-center group-hover:opacity-100 duration-300 ease-in-out transition-opacity pointer-events-none group-hover:pointer-events-auto'>
        <p className='text-sm text-white'>Buy now</p>
      </div>
    </div>
  </Link>
)

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

const OGYCollectionDetails: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [isSelectNFTModalOpen, setIsSelectNFTModalOpen] = useState(false)
  const [isOpenASaleModalOpen, setisOpenASaleModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const collectionCanisterId = window.location.hash.split('/').pop() || ''
  const { isLoading: isUserProfileLoading } = useUserProfile()
  const { data: collection, isLoading, error } = useGetCollectionDetails(collectionCanisterId)

  const { isConnected } = useAuth()

  const perPageOptions = [20, 40, 60]

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const filteredNfts =
    collection?.nfts.filter(nft => nft.name.toLowerCase().includes(searchTerm.toLowerCase())) || []

  const indexOfLastNFT = currentPage * itemsPerPage
  const indexOfFirstNFT = indexOfLastNFT - itemsPerPage
  const currentNFTs = filteredNfts.slice(indexOfFirstNFT, indexOfLastNFT)
  const totalPages = Math.ceil(filteredNfts.length / itemsPerPage)

  const handleSelectNFT = (nft: NFT) => setSelectedNFT(nft)

  const openPriceModal = () => {
    setIsSelectNFTModalOpen(false)
    setisOpenASaleModalOpen(true)
  }

  const closePriceModal = () => {
    setisOpenASaleModalOpen(false)
  }

  return (
    <div className='flex flex-row w-full'>
      <NavBar />
      <div className='bg-gray-100 flex flex-col flex-grow items-center min-h-screen'>
        <Banner collectionName={collection?.name[0] || 'Unknown'} />
        <div className='mt-44 mb-4 md:mt-16 flex flex-row justify-center md:justify-end w-full space-x-6 md:px-[30px] 4xl:px-0 4xl:max-w-7xl'>
          {isConnected && <OpenASale onClick={() => setIsSelectNFTModalOpen(true)} />}
          <ConnectWallet />
        </div>
        <div className='w-[95%] bg-white rounded-[20px] border border-[#e1e1e1] mt-20 md:w-11/12 md:ml-[88px] relative 4xl:max-w-7xl'>
          <div className='flex flex-col items-center mb-10 w-full'>
            <img
              className={`w-40 h-40 ${
                isLoading || isUserProfileLoading ? ' bg-gray-300' : ''
              } rounded-full bg-mouse object-cover shadow-lg border-4 border-white absolute -top-[82px]`}
              src={collection?.logo[0]}
              alt={collection?.name[0]}
            />
            <div className='text-center mt-28 w-full'>
              {isLoading || isUserProfileLoading ? (
                <div className='h-3 bg-gray-300 rounded mx-auto w-1/4 xl:w-1/6 animate-pulse my-2'></div>
              ) : (
                <p className='text-[#69737c] text-[10px] font-medium uppercase leading-[18px] tracking-widest'>
                  {collection?.categoryName || ''}
                </p>
              )}
              {isLoading || isUserProfileLoading ? (
                <div className='h-6 bg-gray-300 rounded mx-auto w-3/4 xl:w-1/4 animate-pulse mt-2'></div>
              ) : (
                <h1 className='text-center text-[#212425] text-[28px] font-bold'>
                  {collection?.name[0] || ''}
                </h1>
              )}
            </div>
          </div>

          <div className='flex flex-col md:flex-row items-center justify-between px-6 md:px-20 mt-6 space-y-6 sm:space-y-0 sm:space-x-12 w-full'>
            <SearchBar handleSearch={handleSearch} placeholder='Search for a specific NFT' />
            <p className='text-[13px] font-semibold leading-[16px] whitespace-nowrap'>
              {isLoading || isUserProfileLoading
                ? 'Loading collection...'
                : `${filteredNfts.length} ${filteredNfts.length > 1 ? 'results' : 'result'}`}
            </p>
          </div>

          <div className='px-3 md:px-20 w-full flex flex-col items-center my-10'>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 w-full'>
              {isLoading || isUserProfileLoading ? (
                Array.from({ length: itemsPerPage }, (_, index) => <NFTSkeleton key={index} />)
              ) : error ? (
                <p>Error while loading NFTs: {error.message}</p>
              ) : (
                currentNFTs.length > 0 &&
                currentNFTs.map(nft => (
                  <NFTCard key={nft.id} nft={nft} canisterId={collectionCanisterId} />
                ))
              )}
            </div>
            {currentNFTs.length === 0 && (
              <div className='flex flex-col items-center justify-center w-full h-[200px]'>
                <h2 className='text-center text-[#69737c] italic font-medium '>
                  No NFTs found in this collection
                </h2>
              </div>
            )}

            <div className='flex flex-row justify-between w-full px-6 md:px-[76px] mt-6 space-y-6 sm:space-y-0 sm:space-x-12'>
              <ItemsPerPage
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                perPageOptions={perPageOptions}
              />

              {totalPages > 1 && !isLoading && (
                <Pagination
                  itemsPerPage={itemsPerPage}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  paginate={setCurrentPage}
                />
              )}
            </div>
          </div>
        </div>

        {isSelectNFTModalOpen && (
          <SelectNFTForSaleModal
            currentNFTs={currentNFTs}
            selectedNFT={selectedNFT}
            handleSelectNFT={handleSelectNFT}
            onClose={() => setIsSelectNFTModalOpen(false)}
            onConfirm={openPriceModal}
          />
        )}
        {isOpenASaleModalOpen && selectedNFT && (
          <OpenASaleModal selectedNFT={selectedNFT} onClose={closePriceModal} />
        )}
      </div>
    </div>
  )
}

export default OGYCollectionDetails
