import React from 'react'

const UserNFTPageSkeleton: React.FC = () => (
  <div className='flex flex-col lg:flex-row bg-white rounded-2xl mx-auto border border-[#e1e1e1] xl:max-w-5xl w-full 4xl:max-w-7xl lg:min-w-[1128px]'>
    <div className='lg:w-[562px] h-[564px] bg-gray-200 animate-pulse rounded-tl-2xl lg:rounded-bl-2xl w-full'></div>
    <div className='flex flex-col justify-center items-start gap-4 mx-10 lg:w-[562px] h-[564px]'>
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

export default UserNFTPageSkeleton
