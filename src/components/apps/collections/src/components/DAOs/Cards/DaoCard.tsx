import React, { useEffect, useState } from 'react'

const DAOCard = ({ isLoading }) => {
  const [isOnProposalPage, setIsOnProposalPage] = useState(false)

  useEffect(() => {
    const urlPath = window.location.href
    const isProposal = /\/daos\/[^/]+\/vote\/[^/]+/.test(urlPath)
    setIsOnProposalPage(isProposal)
  }, [])

  return isLoading ? (
    <DAOCardSkeleton />
  ) : (
    <section className='flex-col items-start gap-2.5 inline-flex w-fit mx-auto'>
      <article className='bg-white rounded-2xl border border-[#e1e1e1] flex-col flex'>
        <img
          className='w-full h-[300px] object-cover ease-in-out transition-transform rounded-t-2xl'
          src='https://placehold.co/468'
          alt='DAO'
        />
        <header className='p-4 flex-col justify-start items-start gap-2 flex'>
          <p className='text-[#69737c] text-[10px] font-medium uppercase leading-[18px] tracking-widest'>
            collection
          </p>
          <h2 className='text-[#212425] text-[28px] font-bold leading-9'>
            The Midsummer Night Dream
          </h2>
        </header>
        <footer className='px-4 py-2 rounded-bl-[20px] rounded-br-[20px] border-t border-[#e1e1e1] flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <span className='w-6 h-6 p-2.5 bg-[#212425] rounded-full flex justify-center items-center text-white text-[13px] font-semibold'>
              4
            </span>
            <span className='text-[#69737c] text-sm font-semibold'>
              You own 4 NFTs of this artwork
            </span>
          </div>
          <button className='w-12 h-12 rounded-full border border-[#e1e1e1] flex justify-center items-center'>
            <img className='w-6 h-6' src='/assets/eye.svg' alt='View' />
          </button>
        </footer>
      </article>

      {isOnProposalPage ? (
        <div className='h-14 p-4 w-full bg-white rounded-full border border-[#e1e1e1] flex items-center gap-1'>
          <span className='w-6 h-6 p-2.5 bg-[#50be8f] rounded-full flex items-center justify-center text-white text-[13px] font-semibold'>
            6
          </span>
          <span className='text-[#212425] text-base font-bold ml-1'>Active proposals</span>
        </div>
      ) : (
        <button className='self-stretch px-[25px] bg-[#212425] rounded-full flex justify-center items-center text-white text-sm font-semibold leading-[48px]'>
          + Make a proposal
        </button>
      )}
    </section>
  )
}

const DAOCardSkeleton = () => (
  <section className='h-[588px] py-10 flex-col justify-center items-start gap-2.5 inline-flex'>
    <article className='bg-white rounded-2xl border border-[#e1e1e1] flex-col flex'>
      <div className='h-[300px] bg-gray-200 animate-pulse rounded-t-2xl' />
      <header className='p-4 flex-col justify-start items-start gap-2 flex'>
        <div className='w-20 h-4 bg-gray-200 animate-pulse rounded' />
        <div className='w-48 h-6 bg-gray-200 animate-pulse rounded mt-2' />
      </header>
      <footer className='px-4 py-2 rounded-bl-[20px] rounded-br-[20px] border-t border-[#e1e1e1] flex justify-between items-center'>
        <div className='w-16 h-4 bg-gray-200 animate-pulse rounded' />
        <div className='w-12 h-12 bg-gray-200 rounded-full animate-pulse' />
      </footer>
    </article>
    <div className='self-stretch px-[25px] bg-gray-200 rounded-full animate-pulse h-12' />
  </section>
)

export default DAOCard
