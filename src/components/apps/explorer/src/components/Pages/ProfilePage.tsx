import React, { useEffect, useState, useMemo, useCallback } from 'react'
import WalletPanel from '../Panels/WalletPanel'
import MyNFTSPanel from '../Panels/MyNFTsPanel'
import TokenTransferModal from '../Modals/TokenTransferModal'
import { Link } from 'react-router-dom'
import UserNFTsList from '../Collections/UserNFTsList'
import { Principal } from '@dfinity/principal'
import { useGetCollectionsList, useUserNFTs } from '@dapp/common-hooks'
import { CollectionType, NFT } from '@dapp/common-types'
import { useAuth } from '@dapp/features-authentication'
import { ConnectWallet, Header, CheckboxBar, SearchBar, FilterBar } from '@dapp/features-components'
import { useUserProfile } from '@dapp/features-userprofile'

const ProfilePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'Wallet' | 'My NFTs'>('Wallet')
  const [filteredCollections, setFilteredCollections] = useState<CollectionType[]>([])
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([])
  const [listedFilter, setListedFilter] = useState<'all' | 'listed' | 'non-listed'>('all')

  const { data } = useGetCollectionsList(0, 20)
  const { isConnected } = useAuth()
  const { userProfile } = useUserProfile()
  const userPrincipal = useMemo(() => {
    try {
      return userProfile ? Principal.fromText(userProfile.walletAddress) : undefined
    } catch (e) {
      console.error('Invalid wallet address:', e)
      return undefined
    }
  }, [userProfile])
  const { data: nfts, isLoading, isError, isFetching } = useUserNFTs(userPrincipal)

  useEffect(() => {
    if (data && nfts) {
      const userCategoryNames = Array.from(new Set(nfts.map(nft => nft.categoryName)))

      const uniqueFilteredCollections: CollectionType[] = []

      userCategoryNames.forEach(categoryName => {
        const matchingCollections = data.collections.filter(
          collection => collection.category_name === categoryName,
        )

        if (matchingCollections.length > 0) {
          const aggregatedCollection = matchingCollections.reduce(
            (acc, curr) => {
              acc.nftCount += curr.nftCount
              return acc
            },
            { ...matchingCollections[0], nftCount: 0n } as CollectionType,
          )

          uniqueFilteredCollections.push({ ...aggregatedCollection, checked: true })
        } else {
          uniqueFilteredCollections.push({
            category_name: categoryName,
            name: 'Unknown',
            image: '',
            nftCount: 0n,
            checked: true,
            canister_id: 'default_canister_id',
            is_promoted: false,
          })
        }
      })

      setFilteredCollections(uniqueFilteredCollections)
    }
  }, [data, nfts])

  useEffect(() => {
    const selectedCollections = filteredCollections
      .filter(collection => collection.checked)
      .map(collection => collection.category_name)

    const filteredNfts = nfts
      ? nfts.filter(nft => {
          const isInSelectedCollection = selectedCollections.includes(nft.categoryName)
          const matchesSearchTerm = nft.name.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesListedFilter =
            listedFilter === 'all' ||
            (listedFilter === 'listed' && nft.saleDetails) ||
            (listedFilter === 'non-listed' && !nft.saleDetails)

          return isInSelectedCollection && matchesSearchTerm && matchesListedFilter
        })
      : []

    setFilteredNfts(filteredNfts)
  }, [nfts, filteredCollections, searchTerm, listedFilter])

  const toggleCheckbox = useCallback((name: string) => {
    setFilteredCollections(prev =>
      prev.map(item => (item.category_name === name ? { ...item, checked: !item.checked } : item)),
    )
  }, [])

  const handleSearch = useCallback(term => {
    setSearchTerm(term)
  }, [])

  const handleModal = useCallback((type: 'transfer' | 'manage', status: boolean) => {
    type === 'transfer' ? setShowTransferModal(status) : setShowManageModal(status)
  }, [])

  const renderWalletContent = useMemo(
    () => (
      <WalletPanel
        onTransferClick={() => handleModal('transfer', true)}
        onManageClick={() => handleModal('manage', true)}
      />
    ),
    [handleModal],
  )

  const renderNFTContent = useMemo(
    () => (
      <div className='flex flex-col items-center w-full'>
        <MyNFTSPanel
          handleSearch={handleSearch}
          filteredCollections={filteredCollections}
          toggleCheckbox={toggleCheckbox}
          setListedFilter={setListedFilter}
        />
        <UserNFTsList
          nfts={filteredNfts}
          isLoading={isLoading}
          isError={isError}
          isFetching={isFetching}
        />
      </div>
    ),
    [
      searchTerm,
      filteredCollections,
      handleSearch,
      toggleCheckbox,
      setListedFilter,
      filteredNfts,
      isLoading,
      isError,
      isFetching,
    ],
  )

  return (
    <div className='relative'>
      {!isConnected && !userProfile && (
        <div className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm z-50'>
          <p className='text-lg text-gray-700 mb-4 w-3/4 text-center xl:w-full'>
            Please press the "Connexion" button below to access your profile.
          </p>
          <ConnectWallet />
          <Link to='/' className='hover:underline pt-4 '>
            Back to Collections
          </Link>
        </div>
      )}

      <div
        className={`bg-gradient-to-b from-white to-[#f7f7f7] flex flex-col items-center w-full min-h-screen ${
          !isConnected ? 'blur-sm' : ''
        }`}
      >
        <Header />
        <div className='w-full mt-2 mb-1 px-6 md:hidden'>
          <h1 className='text-lg font-semibold'>My Account</h1>
        </div>
        <div className='flex w-full h-full border-mouse border-y'>
          <div className='w-full md:hidden'>
            <div className='flex border-b border-gray-300'>
              <button
                className={`flex-1 py-2 border-r border-gray-300 ${
                  activeTab === 'Wallet'
                    ? 'border-b-2 border-b-charcoal text-charcoal font-semibold'
                    : 'text-slate'
                }`}
                onClick={() => setActiveTab('Wallet')}
              >
                Wallet
              </button>
              <button
                className={`flex-1 py-2 ${
                  activeTab === 'My NFTs'
                    ? 'border-b-2 border-charcoal text-charcoal font-semibold'
                    : 'text-slate'
                }`}
                onClick={() => setActiveTab('My NFTs')}
              >
                My NFTs
              </button>
            </div>
            <div className='mt-4'>
              {activeTab === 'Wallet' ? renderWalletContent : renderNFTContent}
            </div>
          </div>

          <div className='hidden md:flex w-full'>
            {renderWalletContent}
            <div className='ml-0 md:ml-[33%] lg:ml-[25%] w-full md:w-3/4 bg-gray-100 flex flex-col flex-grow items-center overflow-y-auto min-h-screen'>
              <div className='flex flex-col xl:flex-row justify-between w-full md:px-[76px] mt-6 space-y-6 sm:space-y-4 xl:space-x-12 xl:space-y-0'>
                <CheckboxBar items={filteredCollections} toggleCheckbox={toggleCheckbox} />
                <SearchBar
                  handleSearch={handleSearch}
                  placeholder='Search for a specific collection'
                />
                <FilterBar setListedFilter={setListedFilter} />
              </div>

              <UserNFTsList
                nfts={filteredNfts}
                isLoading={isLoading}
                isError={isError}
                isFetching={isFetching}
              />
            </div>
          </div>
        </div>
        {showTransferModal && <TokenTransferModal onClose={() => handleModal('transfer', false)} />}
        {/* {showManageModal && <ManageModal onClose={() => handleModal('manage', false)} />} */}
      </div>
    </div>
  )
}

export default ProfilePage
