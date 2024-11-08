import React from 'react'
import { Link } from 'react-router-dom'
import { DAOType } from '@dapp/common-types'
import { VerifiedIcon } from '@dapp/common-assets'
import { ItemsPerPage, Pagination } from '@dapp/features-components'

interface OGYDaosProps {
  daos: DAOType[]
  currentPage: number
  itemsPerPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
  loading: boolean
}

const DAOsList: React.FC<OGYDaosProps> = ({
  daos,
  currentPage,
  itemsPerPage,
  totalPages,
  setCurrentPage,
  setItemsPerPage,
  loading,
}) => {
  const currentItems = daos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const perPageOptions = [20, 40, 60]

  interface SkeletonItemProps {
    isFirstItem?: boolean
  }

  const SkeletonItem: React.FC<SkeletonItemProps> = ({ isFirstItem }) => {
    return isFirstItem ? (
      <div className='w-full p-4 bg-[#f0f0f0] rounded-2xl border border-[#e1e1e1] flex flex-col gap-4 animate-pulse'>
        <div className='w-32 h-32 bg-[#d1d1d1] rounded-2xl' />
        <div className='flex flex-col gap-2 w-full'>
          <div className='h-7 bg-[#d1d1d1] rounded w-full'></div>
          <div className='h-5 bg-[#e1e1e1] rounded mt-2 w-full'></div>
        </div>
      </div>
    ) : (
      <div className='flex p-2 items-center gap-4 border border-[#E1E1E1] rounded-2xl bg-[#f0f0f0] animate-pulse'>
        <div className='h-28 w-28 bg-[#d1d1d1] rounded-2xl' />
        <div className='flex-1 p-4'>
          <div className='h-4 bg-[#d1d1d1] rounded w-1/2 mb-2'></div>
          <div className='h-6 bg-[#e1e1e1] rounded w-3/4'></div>
          <div className='h-4 bg-[#d1d1d1] rounded-full w-1/4 mt-4'></div>
        </div>
      </div>
    )
  }

  const DaosCard = ({ dao, isFirst }: { dao: DAOType; isFirst: boolean }) => (
    <Link
      to={`/daos/${dao.canister_id}`}
      key={dao.canister_id}
      className={`block ${
        isFirst ? 'row-span-2' : 'flex flex-row'
      } hover:bg-[#b7bbd51d] p-4 bg-white border border-[#e1e1e1] rounded-2xl`}
    >
      <img
        className={`${isFirst ? 'w-48 h-48' : 'h-28 w-28'} rounded-2xl object-cover`}
        src={dao.image || 'https://placehold.co/243x244'}
        alt={dao.name || 'Dao Image'}
      />
      <div className={`flex flex-col justify-center ${isFirst ? 'mt-4' : 'p-4 space-y-1'}`}>
        {!isFirst && (
          <h3 className='text-[#69737C] text-[10px] font-medium tracking-[2px] uppercase'>
            <span className='flex flex-row items-center gap-1'>
              {dao.category_name || 'Unknown'} <VerifiedIcon />
            </span>
          </h3>
        )}

        <p className={` ${isFirst ? 'text-[28px]' : 'text-[16px]'} font-bold leading-normal`}>
          {dao.name || 'Unknown'}
        </p>
        <div className='flex flex-row gap-4 items-center'>
          <div className='h-6 py-1 w-fit px-2 bg-[#212425] rounded-[100px] inline-flex items-center justify-center'>
            <span className='text-white text-xs font-semibold'>
              {dao.nftCount && dao.nftCount > 1
                ? `${dao.nftCount} NFTs holders`
                : `${dao.nftCount || 0} NFT holder`}
            </span>
          </div>
          {isFirst && (
            <h3 className='text-[#69737C] text-[10px] font-medium tracking-[2px] uppercase'>
              <span className='flex flex-row items-center gap-1'>
                {dao.category_name || 'Unknown'} <VerifiedIcon />
              </span>
            </h3>
          )}
        </div>
      </div>
    </Link>
  )

  return (
    <div className='bg-white rounded-2xl mt-8 w-full p-4 md:p-8 border border-[#e1e1e1] shadow-md'>
      <h3 className='font-semibold text-2xl'>All DAOs</h3>
      <p className='text-slate text-[13px] font-medium'>
        {loading ? 'Loading daos...' : `${daos.length} daos`}
      </p>

      <div className='w-full mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6'>
        {loading
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
              <SkeletonItem key={index} isFirstItem={index === 0} />
            ))
          : currentItems.map((dao, index) => (
              <DaosCard key={dao.canister_id} dao={dao} isFirst={index === 0} />
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

export default DAOsList
