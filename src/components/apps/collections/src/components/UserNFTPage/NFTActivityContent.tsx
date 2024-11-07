import React, { useEffect, useState } from 'react'
import { NFT } from '../../types/global'
import { Transaction, useGetNFTActivity } from '../../hooks/useGetNFTActivity'
import { useResponsiveTruncate } from '../../utils/responsiveTruncate'
import TableSkeleton from './Skeletons/TableSkeleton'
import Pagination from '../Pagination/Pagination'
import ErrorMessage from './ErrorMessage'

interface NFTActivityContentProps {
  nft: NFT
  canisterId: string
}

const NFTActivityContent = ({ nft, canisterId }: NFTActivityContentProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [NFTactivity, setNFTactivity] = useState<Transaction[]>([])
  const truncateAddress = useResponsiveTruncate()

  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const offset = (currentPage - 1) * itemsPerPage
  const limit = itemsPerPage

  const { data, isLoading, isError, error } = useGetNFTActivity(
    nft.id,
    canisterId,
    BigInt(offset),
    BigInt(limit),
  )

  useEffect(() => {
    if (data) {
      setNFTactivity(data)
    }
  }, [data])

  const currentItems = NFTactivity.slice(indexOfFirstItem, indexOfLastItem)

  if (isLoading) {
    return <TableSkeleton />
  }
  if (isError) {
    return <ErrorMessage message={error.message} />
  }
  if (!NFTactivity || NFTactivity.length === 0) {
    return <p className='text-center text-gray-500 italic mb-14'>No activity found for this NFT</p>
  }

  const getStringAddress = (address: string | string[] | undefined): string => {
    if (Array.isArray(address)) {
      return address.length > 0 ? address[0] : 'N/A'
    }
    return address || 'N/A'
  }

  return (
    <div className='bg-white rounded-2xl md:px-12 px-6 pt-6 md:pt-12 mb-14 mx-auto border border-[#e1e1e1] xl:max-w-5xl 4xl:max-w-7xl xl:min-w-[1128px] md:ml-28 w-10/12 xl:mx-auto'>
      {/* Large screen table */}
      <div className='hidden md:block'>
        <table className='w-full '>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600'>
                Index
              </th>
              <th className='py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600'>
                Type
              </th>
              <th className='py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600'>
                Timestamp
              </th>
              <th className='py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600'>
                From
              </th>
              <th className='py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600'>
                To
              </th>
              <th className='py-2 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600'>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(activity => (
              <tr key={activity.index} className='hover:bg-gray-100'>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  {activity.index}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  {activity.txn_type.type}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  {activity.timestamp ? new Date(activity.timestamp / 1e6).toLocaleString() : 'N/A'}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  {truncateAddress(
                    getStringAddress(activity.txn_type.from || activity.txn_type.seller),
                  )}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  {truncateAddress(
                    getStringAddress(activity.txn_type.to || activity.txn_type.buyer),
                  )}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  {activity.txn_type.amount
                    ? activity.txn_type.amount / 10 ** activity.txn_type.token.data.decimals
                    : 'N/A'}{' '}
                  {activity.txn_type.token?.data.symbol || ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile screen table */}
      <div className='md:hidden space-y-4'>
        {currentItems.map(activity => (
          <div key={activity.index} className=''>
            <div className='flex justify-between mb-2'>
              <span className='font-semibold text-gray-700'>Index:</span>
              <span className='text-gray-700'>{activity.index}</span>
            </div>
            <div className='flex justify-between mb-2'>
              <span className='font-semibold text-gray-700'>Type:</span>
              <span className='text-gray-700 capitalize'>
                {activity.txn_type.type.replace('_', ' ')}
              </span>
            </div>
            <div className='flex justify-between mb-2'>
              <span className='font-semibold text-gray-700'>Timestamp:</span>
              <span className='text-gray-700 text-right'>
                {activity.timestamp ? new Date(activity.timestamp / 1e6).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className='flex justify-between mb-2'>
              <span className='font-semibold text-gray-700'>From:</span>
              <span className='text-gray-700'>
                {truncateAddress(
                  getStringAddress(activity.txn_type.from || activity.txn_type.seller),
                )}
              </span>
            </div>
            <div className='flex justify-between mb-2'>
              <span className='font-semibold text-gray-700'>To:</span>
              <span className='text-gray-700'>
                {truncateAddress(getStringAddress(activity.txn_type.to || activity.txn_type.buyer))}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='font-semibold text-gray-700'>Amount:</span>
              <span className='text-gray-700'>
                {activity.txn_type.amount
                  ? activity.txn_type.amount / 10 ** activity.txn_type.token.data.decimals
                  : 'N/A'}{' '}
                {activity.txn_type.token?.data.symbol || ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className='mt-4'>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalPages={Math.ceil(NFTactivity.length / itemsPerPage)}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </div>
  )
}

export default NFTActivityContent
