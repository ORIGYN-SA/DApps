import React from 'react'
const DAOCard = ({ isLoading }) => {
  return isLoading ? (
    <DAOCardSkeleton />
  ) : (
    <div className=' flex-col  items-start gap-2.5 inline-flex w-fit mx-auto'>
      <div className='bg-white rounded-2xl border border-[#e1e1e1] flex-col flex'>
        <img
          className='w-full h-[300px] object-cover ease-in-out transition-transform rounded-t-2xl'
          src='https://placehold.co/468'
          alt='DAO'
        />
        <div className='p-4 flex-col justify-start items-start gap-2 flex'>
          <div className='text-[#69737c] text-[10px] font-medium uppercase leading-[18px] tracking-widest'>
            collection
          </div>
          <div className='text-[#212425] text-[28px] font-bold leading-9'>
            The midsummer Night Dream
          </div>
        </div>
        <div className='px-4 py-2 rounded-bl-[20px] rounded-br-[20px] border-t border-[#e1e1e1] justify-between items-center inline-flex'>
          <div className='justify-start items-center gap-2 flex'>
            <div className='w-6 h-6 p-2.5 bg-[#212425] rounded-full flex justify-center items-center'>
              <div className='text-white text-[13px] font-semibold leading-none'>4</div>
            </div>
            <div className='text-[#69737c] text-sm font-semibold leading-[18px]'>
              You own 4 NFTs of this artwork
            </div>
          </div>
          <div className='w-12 h-12 flex justify-center items-center gap-2.5'>
            <div className='w-12 h-12 rounded-full border border-[#e1e1e1] flex justify-center items-center'>
              <div className='w-6 h-6 justify-center items-center flex'>
                <img className='w-6 h-6' src='/assets/eye.svg' alt='eye icon' />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='self-stretch px-[25px] bg-[#212425] rounded-full justify-center items-center gap-2.5 inline-flex'>
        <div className='text-center text-white text-sm font-semibold leading-[48px]'>
          + Make a proposal
        </div>
      </div>
    </div>
  )
}

const DAOCardSkeleton = () => (
  <div className='h-[588px] py-10 flex-col justify-center items-start gap-2.5 inline-flex'>
    <div className='bg-white rounded-2xl border border-[#e1e1e1] flex-col flex'>
      <div className='h-[300px] bg-gray-200 animate-pulse rounded-t-2xl' />
      <div className='p-4 flex-col justify-start items-start gap-2 flex'>
        <div className='w-20 h-4 bg-gray-200 animate-pulse rounded' />
        <div className='w-48 h-6 bg-gray-200 animate-pulse rounded mt-2' />
      </div>
      <div className='px-4 py-2 rounded-bl-[20px] rounded-br-[20px] border-t border-[#e1e1e1] justify-between items-center inline-flex'>
        <div className='justify-start items-center gap-2 flex'>
          <div className='w-16 h-4 bg-gray-200 animate-pulse rounded' />
        </div>
        <div className='w-12 h-12 bg-gray-200 rounded-full animate-pulse' />
      </div>
    </div>
    <div className='self-stretch px-[25px] bg-gray-200 rounded-full animate-pulse h-12' />
  </div>
)

export default DAOCard
