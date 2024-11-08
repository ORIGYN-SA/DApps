import React, { useEffect, useState } from 'react'
import TableSkeleton from './Skeletons/TableSkeleton'
import ErrorMessage from './ErrorMessage'
import { format } from 'util'
import { useGetNFTActivity } from '@dapp/common-hooks'
import { NFT } from '@dapp/common-types'
import { Pagination } from '@dapp/features-components'
import { useResponsiveTruncate } from '@dapp/utils'

interface NFTActivityContentProps {
  nft: NFT
  canisterId: string
}

const NFTActivityContent = ({ nft, canisterId }: NFTActivityContentProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const truncateAddress = useResponsiveTruncate()

  const {
    data: NFTactivity,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetNFTActivity(nft.id, canisterId)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = NFTactivity ? NFTactivity.slice(indexOfFirstItem, indexOfLastItem) : []

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth <= 640 ? 5 : 10)
    }

    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  if (isLoading || isFetching) {
    return <TableSkeleton />
  }
  if (isError) {
    return <ErrorMessage message={error.message} />
  }
  if (!NFTactivity || NFTactivity.length === 0) {
    return <p className='text-center text-gray-500 italic mb-14'>No activity found for this NFT</p>
  }

  const parseTimestamp = (timestampStr: string | null): string => {
    if (!timestampStr) return 'N/A'
    try {
      const timestampBigInt = BigInt(timestampStr)
      const timestampMillis = timestampBigInt / BigInt(1e6)
      if (timestampMillis <= BigInt(Number.MAX_SAFE_INTEGER)) {
        const date = new Date(Number(timestampMillis))
        const formattedDate = date.toLocaleString(format('en-US'), {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })

        return formattedDate
      }
      return 'Date too large'
    } catch {
      return 'Invalid timestamp'
    }
  }

  const getStringAddress = (address: string | 'N/A'): string => {
    return address !== 'N/A' ? truncateAddress(address) : 'N/A'
  }

  return (
    <div className='bg-white rounded-2xl px-6 md:px-0 xl:px-6  pt-6 md:p-6 mb-14 mx-auto border border-[#e1e1e1] xl:max-w-5xl 4xl:max-w-7xl xl:min-w-[1128px] md:ml-28 w-10/12 lg:ml-28 xl:mx-auto'>
      <div className='hidden md:block'>
        <table className='w-full'>
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
                  {parseTimestamp(activity.timestamp)}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  {getStringAddress(activity.txn_type.from)}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  {getStringAddress(activity.txn_type.to)}
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  {activity.formattedAmount !== 'N/A' ? (
                    <>
                      {activity.formattedAmount} {activity.txn_type.token.data.symbol}
                    </>
                  ) : (
                    'N/A'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='md:hidden space-y-4'>
        {currentItems.map(activity => (
          <div key={activity.index} className='bg-gray-50 p-4 rounded-lg shadow'>
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
              <span className='text-gray-700 text-right'>{parseTimestamp(activity.timestamp)}</span>
            </div>
            <div className='flex justify-between mb-2'>
              <span className='font-semibold text-gray-700'>From:</span>
              <span className='text-gray-700'>{getStringAddress(activity.txn_type.from)}</span>
            </div>
            <div className='flex justify-between mb-2'>
              <span className='font-semibold text-gray-700'>To:</span>
              <span className='text-gray-700'>{getStringAddress(activity.txn_type.to)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-semibold text-gray-700'>Amount:</span>
              <span className='text-gray-700'>
                {activity.formattedAmount !== 'N/A' ? (
                  <>
                    {activity.formattedAmount} {activity.txn_type.token.data.symbol}
                  </>
                ) : (
                  'N/A'
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className='my-4'>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalPages={Math.ceil((NFTactivity?.length || 0) / itemsPerPage)}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </div>
  )
}

export default NFTActivityContent
