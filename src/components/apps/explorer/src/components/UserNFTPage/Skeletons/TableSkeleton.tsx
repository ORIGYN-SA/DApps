import React from 'react'

const TableSkeleton = () => {
  const rows = Array.from({ length: 5 })

  return (
    <div className='bg-white rounded-2xl md:px-12 px-6 pt-6 md:pt-12 mb-14 mx-auto border border-[#e1e1e1] xl:max-w-5xl 4xl:max-w-7xl xl:min-w-[1128px] md:ml-28 w-10/12 xl:mx-auto'>
      {/* Large screen skeleton */}
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
            {rows.map((_, index) => (
              <tr key={index} className='hover:bg-gray-100 animate-pulse'>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  <div className='h-4 bg-gray-200 rounded w-16'></div>
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  <div className='h-4 bg-gray-200 rounded w-24'></div>
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  <div className='h-4 bg-gray-200 rounded w-32'></div>
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  <div className='h-4 bg-gray-200 rounded w-32'></div>
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  <div className='h-4 bg-gray-200 rounded w-32'></div>
                </td>
                <td className='py-2 px-4 border-b border-gray-200 text-sm text-gray-700'>
                  <div className='h-4 bg-gray-200 rounded w-20'></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile screen skeleton */}
      <div className='md:hidden space-y-4'>
        {rows.map((_, index) => (
          <div
            key={index}
            className='bg-white rounded-lg shadow p-4 border border-gray-200 animate-pulse'
          >
            <div className='flex justify-between mb-2'>
              <span className='font-semibold text-gray-700'>Index:</span>
              <div className='h-4 bg-gray-200 rounded w-1/2'></div>
            </div>
            <div className='flex justify-between mb-2'>
              <span className='font-semibold text-gray-700'>Type:</span>
              <div className='h-4 bg-gray-200 rounded w-1/3'></div>
            </div>
            <div className='flex justify-between mb-2'>
              <span className='font-semibold text-gray-700'>Timestamp:</span>
              <div className='h-4 bg-gray-200 rounded w-1/3'></div>
            </div>
            <div className='flex justify-between mb-2'>
              <span className='font-semibold text-gray-700'>From:</span>
              <div className='h-4 bg-gray-200 rounded w-1/3'></div>
            </div>
            <div className='flex justify-between mb-2'>
              <span className='font-semibold text-gray-700'>To:</span>
              <div className='h-4 bg-gray-200 rounded w-1/3'></div>
            </div>
            <div className='flex justify-between'>
              <span className='font-semibold text-gray-700'>Amount:</span>
              <div className='h-4 bg-gray-200 rounded w-1/4'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableSkeleton
