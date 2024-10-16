import React from 'react'
import Pagination from '../Pagination/Pagination'
import SkeletonItem from './SkeletonItem'
import { Link } from 'react-router-dom'
import { CollectionType } from '../../types/global'
import ItemsPerPage from '../Utils/ItemsPerPage'

interface OGYCollectionsProps {
  collections: CollectionType[]
  currentPage: number
  itemsPerPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
  loading: boolean
}

const OGYCollectionsList: React.FC<OGYCollectionsProps> = ({
  collections,
  currentPage,
  itemsPerPage,
  totalPages,
  setCurrentPage,
  setItemsPerPage,
  loading,
}) => {
  const currentItems = collections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const perPageOptions = [20, 40, 60]

  const CollectionCard = ({
    collection,
    isFirst,
  }: {
    collection: CollectionType
    isFirst: boolean
  }) => (
    <Link
      to={`/collection/${collection.canister_id}`}
      key={collection.canister_id}
      className={`block ${
        isFirst ? 'row-span-2' : 'flex flex-row'
      } hover:bg-[#b7bbd51d] p-4 bg-white border border-[#e1e1e1] rounded-2xl`}
    >
      <img
        className={`${isFirst ? 'w-36 h-36' : 'h-28 w-28'} rounded-2xl object-cover`}
        src={collection.image || 'https://via.placeholder.com/243x244'}
        alt={collection.name || 'Collection Image'}
      />
      <div className={`flex flex-col justify-center ${isFirst ? 'mt-2 space-y-2' : 'p-4'}`}>
        <h3 className='text-[#69737C] text-[10px] font-medium tracking-[2px] uppercase'>
          {collection.category_name || 'Unknown'}
        </h3>
        <p className='text-[16px] font-bold leading-normal'>{collection.name || 'Unknown'}</p>
        <div className='h-6 py-1 w-fit px-4 bg-[#212425] rounded-[100px] inline-flex items-center justify-center'>
          <span className='text-white text-xs font-semibold'>
            {collection.nftCount && collection.nftCount > 1
              ? `${collection.nftCount} NFTs`
              : `${collection.nftCount || 0} NFT`}
          </span>
        </div>
      </div>
    </Link>
  )

  return (
    <div className='bg-white rounded-2xl mt-8 w-full p-4 md:p-8 border border-[#e1e1e1] shadow-md'>
      <h3 className='font-semibold text-2xl'>All Collections</h3>
      <p className='text-slate text-[13px] font-medium'>
        {loading ? 'Loading collections...' : `${collections.length} collections`}
      </p>

      <div className='w-full mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {loading
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
              <SkeletonItem key={index} isFirstItem={index === 0} />
            ))
          : currentItems.map((collection, index) => (
              <CollectionCard
                key={collection.canister_id}
                collection={collection}
                isFirst={index === 0}
              />
            ))}
      </div>

      <div className='flex flex-row w-full items-center mt-6'>
        <ItemsPerPage
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          perPageOptions={perPageOptions}
        />
        {totalPages > 1 && (
          <div className='ml-auto'>
            <Pagination
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              currentPage={currentPage}
              paginate={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default OGYCollectionsList
