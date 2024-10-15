import React, { useEffect, useState } from 'react'
import { NFT } from '../../types/global'
import Pagination from '../Pagination/Pagination'
import { useUserProfile } from '../../context/UserProfileContext'
import { useUserNFTs } from '../../hooks/useGetUserNFTS'
import { Principal } from '@dfinity/principal'
import Loader from '../Utils/Loader'

interface UserNFTsListProps {
  selectedNFT: NFT | null
  handleSelectNFT: (nft: NFT) => void
}

const UserNFTsList: React.FC<UserNFTsListProps> = ({ selectedNFT, handleSelectNFT }) => {
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [currentPage, setCurrentPage] = useState(1)

  const { userProfile } = useUserProfile()
  if (!userProfile) {
    return <Loader />
  }

  // const {
  //   data: nfts,
  //   isLoading,
  //   isError,
  // } = useUserNFTs(Principal.fromText(userProfile.walletAddress))

  const nfts = [
    {
      id: '1',
      name: 'Golden Artifact #1',
      collectionName: 'Ancient Relics',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 150,
      currency: 'OGY',
      priceUSD: 45,
      owner: 'Principal ID 1',
    },
    {
      id: '2',
      name: 'Silver Shield #2',
      collectionName: 'Medieval Weapons',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 200,
      currency: 'ICP',
      priceUSD: 60,
      owner: 'Principal ID 2',
    },
    {
      id: '3',
      name: 'Mystic Sword #3',
      collectionName: 'Legendary Blades',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 300,
      currency: 'OGY',
      priceUSD: 90,
      owner: 'Principal ID 3',
    },
    {
      id: '4',
      name: 'Crystal Crown #4',
      collectionName: 'Royal Treasures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 450,
      currency: 'ICP',
      priceUSD: 135,
      owner: 'Principal ID 4',
    },
    {
      id: '5',
      name: 'Phoenix Feather #5',
      collectionName: 'Mythical Creatures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 600,
      currency: 'OGY',
      priceUSD: 180,
      owner: 'Principal ID 5',
    },
    {
      id: '6',
      name: 'Golden Artifact #6',
      collectionName: 'Ancient Relics',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 160,
      currency: 'OGY',
      priceUSD: 48,
      owner: 'Principal ID 6',
    },
    {
      id: '7',
      name: 'Silver Shield #7',
      collectionName: 'Medieval Weapons',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 210,
      currency: 'ICP',
      priceUSD: 63,
      owner: 'Principal ID 7',
    },
    {
      id: '8',
      name: 'Mystic Sword #8',
      collectionName: 'Legendary Blades',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 320,
      currency: 'OGY',
      priceUSD: 96,
      owner: 'Principal ID 8',
    },
    {
      id: '9',
      name: 'Crystal Crown #9',
      collectionName: 'Royal Treasures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 460,
      currency: 'ICP',
      priceUSD: 138,
      owner: 'Principal ID 9',
    },
    {
      id: '10',
      name: 'Phoenix Feather #10',
      collectionName: 'Mythical Creatures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 620,
      currency: 'OGY',
      priceUSD: 186,
      owner: 'Principal ID 10',
    },
    {
      id: '11',
      name: 'Golden Artifact #11',
      collectionName: 'Ancient Relics',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 170,
      currency: 'OGY',
      priceUSD: 51,
      owner: 'Principal ID 11',
    },
    {
      id: '12',
      name: 'Silver Shield #12',
      collectionName: 'Medieval Weapons',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 220,
      currency: 'ICP',
      priceUSD: 66,
      owner: 'Principal ID 12',
    },
    {
      id: '13',
      name: 'Mystic Sword #13',
      collectionName: 'Legendary Blades',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 330,
      currency: 'OGY',
      priceUSD: 99,
      owner: 'Principal ID 13',
    },
    {
      id: '14',
      name: 'Crystal Crown #14',
      collectionName: 'Royal Treasures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 470,
      currency: 'ICP',
      priceUSD: 141,
      owner: 'Principal ID 14',
    },
    {
      id: '15',
      name: 'Phoenix Feather #15',
      collectionName: 'Mythical Creatures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 630,
      currency: 'OGY',
      priceUSD: 189,
      owner: 'Principal ID 15',
    },
    {
      id: '16',
      name: 'Golden Artifact #16',
      collectionName: 'Ancient Relics',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 180,
      currency: 'OGY',
      priceUSD: 54,
      owner: 'Principal ID 16',
    },
    {
      id: '17',
      name: 'Silver Shield #17',
      collectionName: 'Medieval Weapons',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 230,
      currency: 'ICP',
      priceUSD: 69,
      owner: 'Principal ID 17',
    },
    {
      id: '18',
      name: 'Mystic Sword #18',
      collectionName: 'Legendary Blades',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 340,
      currency: 'OGY',
      priceUSD: 102,
      owner: 'Principal ID 18',
    },
    {
      id: '19',
      name: 'Crystal Crown #19',
      collectionName: 'Royal Treasures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 480,
      currency: 'ICP',
      priceUSD: 144,
      owner: 'Principal ID 19',
    },
    {
      id: '20',
      name: 'Phoenix Feather #20',
      collectionName: 'Mythical Creatures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 640,
      currency: 'OGY',
      priceUSD: 192,
      owner: 'Principal ID 20',
    },
    {
      id: '21',
      name: 'Golden Artifact #21',
      collectionName: 'Ancient Relics',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 190,
      currency: 'OGY',
      priceUSD: 57,
      owner: 'Principal ID 21',
    },
    {
      id: '22',
      name: 'Silver Shield #22',
      collectionName: 'Medieval Weapons',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 240,
      currency: 'ICP',
      priceUSD: 72,
      owner: 'Principal ID 22',
    },
    {
      id: '23',
      name: 'Mystic Sword #23',
      collectionName: 'Legendary Blades',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 350,
      currency: 'OGY',
      priceUSD: 105,
      owner: 'Principal ID 23',
    },
    {
      id: '24',
      name: 'Crystal Crown #24',
      collectionName: 'Royal Treasures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 490,
      currency: 'ICP',
      priceUSD: 147,
      owner: 'Principal ID 24',
    },
    {
      id: '25',
      name: 'Phoenix Feather #25',
      collectionName: 'Mythical Creatures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 650,
      currency: 'OGY',
      priceUSD: 195,
      owner: 'Principal ID 25',
    },
    {
      id: '26',
      name: 'Golden Artifact #26',
      collectionName: 'Ancient Relics',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 200,
      currency: 'OGY',
      priceUSD: 60,
      owner: 'Principal ID 26',
    },
    {
      id: '27',
      name: 'Silver Shield #27',
      collectionName: 'Medieval Weapons',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 250,
      currency: 'ICP',
      priceUSD: 75,
      owner: 'Principal ID 27',
    },
    {
      id: '28',
      name: 'Mystic Sword #28',
      collectionName: 'Legendary Blades',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 360,
      currency: 'OGY',
      priceUSD: 108,
      owner: 'Principal ID 28',
    },
    {
      id: '29',
      name: 'Crystal Crown #29',
      collectionName: 'Royal Treasures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 500,
      currency: 'ICP',
      priceUSD: 150,
      owner: 'Principal ID 29',
    },
    {
      id: '30',
      name: 'Phoenix Feather #30',
      collectionName: 'Mythical Creatures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 660,
      currency: 'OGY',
      priceUSD: 198,
      owner: 'Principal ID 30',
    },
    {
      id: '31',
      name: 'Golden Artifact #31',
      collectionName: 'Ancient Relics',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 210,
      currency: 'OGY',
      priceUSD: 63,
      owner: 'Principal ID 31',
    },
    {
      id: '32',
      name: 'Silver Shield #32',
      collectionName: 'Medieval Weapons',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 260,
      currency: 'ICP',
      priceUSD: 78,
      owner: 'Principal ID 32',
    },
    {
      id: '33',
      name: 'Mystic Sword #33',
      collectionName: 'Legendary Blades',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 370,
      currency: 'OGY',
      priceUSD: 111,
      owner: 'Principal ID 33',
    },
    {
      id: '34',
      name: 'Crystal Crown #34',
      collectionName: 'Royal Treasures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 510,
      currency: 'ICP',
      priceUSD: 153,
      owner: 'Principal ID 34',
    },
    {
      id: '35',
      name: 'Phoenix Feather #35',
      collectionName: 'Mythical Creatures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 670,
      currency: 'OGY',
      priceUSD: 201,
      owner: 'Principal ID 35',
    },
    {
      id: '36',
      name: 'Golden Artifact #36',
      collectionName: 'Ancient Relics',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 220,
      currency: 'OGY',
      priceUSD: 66,
      owner: 'Principal ID 36',
    },
    {
      id: '37',
      name: 'Silver Shield #37',
      collectionName: 'Medieval Weapons',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 270,
      currency: 'ICP',
      priceUSD: 81,
      owner: 'Principal ID 37',
    },
    {
      id: '38',
      name: 'Mystic Sword #38',
      collectionName: 'Legendary Blades',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 380,
      currency: 'OGY',
      priceUSD: 114,
      owner: 'Principal ID 38',
    },
    {
      id: '39',
      name: 'Crystal Crown #39',
      collectionName: 'Royal Treasures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 520,
      currency: 'ICP',
      priceUSD: 156,
      owner: 'Principal ID 39',
    },
    {
      id: '40',
      name: 'Phoenix Feather #40',
      collectionName: 'Mythical Creatures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 680,
      currency: 'OGY',
      priceUSD: 204,
      owner: 'Principal ID 40',
    },
    {
      id: '41',
      name: 'Golden Artifact #41',
      collectionName: 'Ancient Relics',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 230,
      currency: 'OGY',
      priceUSD: 69,
      owner: 'Principal ID 41',
    },
    {
      id: '42',
      name: 'Silver Shield #42',
      collectionName: 'Medieval Weapons',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 280,
      currency: 'ICP',
      priceUSD: 84,
      owner: 'Principal ID 42',
    },
    {
      id: '43',
      name: 'Mystic Sword #43',
      collectionName: 'Legendary Blades',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 390,
      currency: 'OGY',
      priceUSD: 117,
      owner: 'Principal ID 43',
    },
    {
      id: '44',
      name: 'Crystal Crown #44',
      collectionName: 'Royal Treasures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 530,
      currency: 'ICP',
      priceUSD: 159,
      owner: 'Principal ID 44',
    },
    {
      id: '45',
      name: 'Phoenix Feather #45',
      collectionName: 'Mythical Creatures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 690,
      currency: 'OGY',
      priceUSD: 207,
      owner: 'Principal ID 45',
    },
    {
      id: '46',
      name: 'Golden Artifact #46',
      collectionName: 'Ancient Relics',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 240,
      currency: 'OGY',
      priceUSD: 72,
      owner: 'Principal ID 46',
    },
    {
      id: '47',
      name: 'Silver Shield #47',
      collectionName: 'Medieval Weapons',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 290,
      currency: 'ICP',
      priceUSD: 87,
      owner: 'Principal ID 47',
    },
    {
      id: '48',
      name: 'Mystic Sword #48',
      collectionName: 'Legendary Blades',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 400,
      currency: 'OGY',
      priceUSD: 120,
      owner: 'Principal ID 48',
    },
    {
      id: '49',
      name: 'Crystal Crown #49',
      collectionName: 'Royal Treasures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 540,
      currency: 'ICP',
      priceUSD: 162,
      owner: 'Principal ID 49',
    },
    {
      id: '50',
      name: 'Phoenix Feather #50',
      collectionName: 'Mythical Creatures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 700,
      currency: 'OGY',
      priceUSD: 210,
      owner: 'Principal ID 50',
    },
    {
      id: '51',
      name: 'Golden Artifact #51',
      collectionName: 'Ancient Relics',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 250,
      currency: 'OGY',
      priceUSD: 75,
      owner: 'Principal ID 51',
    },
    {
      id: '52',
      name: 'Silver Shield #52',
      collectionName: 'Medieval Weapons',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 300,
      currency: 'ICP',
      priceUSD: 90,
      owner: 'Principal ID 52',
    },
    {
      id: '53',
      name: 'Mystic Sword #53',
      collectionName: 'Legendary Blades',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 410,
      currency: 'OGY',
      priceUSD: 123,
      owner: 'Principal ID 53',
    },
    {
      id: '54',
      name: 'Crystal Crown #54',
      collectionName: 'Royal Treasures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 550,
      currency: 'ICP',
      priceUSD: 165,
      owner: 'Principal ID 54',
    },
    {
      id: '55',
      name: 'Phoenix Feather #55',
      collectionName: 'Mythical Creatures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 710,
      currency: 'OGY',
      priceUSD: 213,
      owner: 'Principal ID 55',
    },
    {
      id: '56',
      name: 'Golden Artifact #56',
      collectionName: 'Ancient Relics',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 260,
      currency: 'OGY',
      priceUSD: 78,
      owner: 'Principal ID 56',
    },
    {
      id: '57',
      name: 'Silver Shield #57',
      collectionName: 'Medieval Weapons',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 310,
      currency: 'ICP',
      priceUSD: 93,
      owner: 'Principal ID 57',
    },
    {
      id: '58',
      name: 'Mystic Sword #58',
      collectionName: 'Legendary Blades',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 420,
      currency: 'OGY',
      priceUSD: 126,
      owner: 'Principal ID 58',
    },
    {
      id: '59',
      name: 'Crystal Crown #59',
      collectionName: 'Royal Treasures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 560,
      currency: 'ICP',
      priceUSD: 168,
      owner: 'Principal ID 59',
    },
    {
      id: '60',
      name: 'Phoenix Feather #60',
      collectionName: 'Mythical Creatures',
      image: 'https://via.placeholder.com/243',
      logo: 'https://via.placeholder.com/50',
      price: 720,
      currency: 'OGY',
      priceUSD: 216,
      owner: 'Principal ID 60',
    },
  ]

  const isLoading = false
  const isError = false

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth <= 640 ? 4 : 8)
    }

    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [setItemsPerPage])

  const filteredNfts = nfts?.filter(nft => nft.name.toLowerCase()) || []

  const indexOfLastNFT = currentPage * itemsPerPage
  const indexOfFirstNFT = indexOfLastNFT - itemsPerPage
  const currentNFTs = filteredNfts.slice(indexOfFirstNFT, indexOfLastNFT)
  const totalPages = Math.ceil(filteredNfts.length / itemsPerPage)

  return (
    <>
      <div className='flex flex-col justify-center w-full items-center'>
        {isLoading && !isError && <Loader size={40} />}
        {isError && (
          <p className='text-center text-[#69737c] text-[13px] italic font-medium mb-4 px-6'>
            Error loading your NFTs, please try again later.
          </p>
        )}
      </div>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full px-6 md:px-5'>
        {!isLoading &&
          !isError &&
          nfts &&
          currentNFTs.length > 0 &&
          currentNFTs.map(nft => (
            <div
              key={nft.id}
              className={`block cursor-pointer border rounded-2xl bg-white transition duration-300 ${
                selectedNFT?.id === nft.id ? 'border-[#33B9FF] border-2' : 'border-gray-300'
              }`}
              onClick={() => handleSelectNFT(nft)}
            >
              <div className='flex p-2 items-center gap-4'>
                <img
                  src={nft.image || 'https://via.placeholder.com/243'}
                  alt={nft.name || 'NFT Image'}
                  className='h-28 w-28 rounded-2xl object-contain'
                />
                <div className='w-1/2'>
                  <h3 className='text-[#69737C] font-medium text-[10px] leading-[18px] tracking-[2px] uppercase'>
                    {nft.collectionName || 'Unknown'}
                  </h3>
                  <p className='text-[16px] font-bold leading-normal'>{nft.name || 'Unknown'}</p>
                </div>
              </div>
            </div>
          ))}
        {!isLoading && !isError && nfts && nfts.length === 0 && <p>No NFTs found</p>}
      </div>
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

export default UserNFTsList
