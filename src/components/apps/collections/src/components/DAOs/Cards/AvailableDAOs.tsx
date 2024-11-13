import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface AvailableDAOsProps {
  isLoading: boolean
}

const AvailableDAOs = ({ isLoading }: AvailableDAOsProps) => {
  if (isLoading) return <AvailableDAOsSkeleton />

  return (
    <section className='px-6 py-8 w-full md:w-3/4 mx-auto xl:w-full bg-white rounded-2xl shadow border border-[#e1e1e1] flex flex-col gap-8'>
      <header className='flex justify-between items-start'>
        <div>
          <h2 className="text-[#212425] text-[22px] font-semibold font-['DM Sans']">
            All DAOs available
          </h2>
          <p className="text-[#69737c] text-[13px] font-medium font-['DM Sans']">3 collections</p>
        </div>
      </header>
      <ul className='flex flex-col gap-6'>
        <li>
          <Link to='/daos/bob/vote' className='block'>
            <article className='h-32 p-2 w-fit bg-white md:pr-12 rounded-2xl border border-[#e1e1e1] flex items-center gap-4'>
              <img
                className='w-28 h-28 rounded-2xl object-cover'
                src='https://placehold.co/112x112'
                alt='DAO'
              />
              <div className='flex-1 flex flex-col justify-center gap-2'>
                <div className='flex items-center gap-0.5'>
                  <span className='text-[#69737c] text-[10px] font-medium uppercase leading-[18px] tracking-widest'>
                    collection
                  </span>
                </div>
                <h3 className='text-[#212425] text-base font-bold font-["DM Sans"]'>
                  The Midsummer Night Dream
                </h3>
                <span className='px-2 py-1 bg-[#212425] w-fit rounded-full text-white text-xs font-bold'>
                  139 NFTs holders
                </span>
              </div>
            </article>
          </Link>
        </li>
      </ul>
    </section>
  )
}

const AvailableDAOsSkeleton = () => (
  <section className='px-6 py-8 w-full md:w-3/4 mx-auto xl:w-full bg-gray-200 rounded-2xl animate-pulse shadow border border-gray-300 flex flex-col gap-8'>
    <header className='flex justify-between items-start'>
      <div className='space-y-2'>
        <div className='w-20 h-6 bg-gray-300 rounded' />
        <div className='w-32 h-4 bg-gray-300 rounded' />
      </div>
    </header>
    <ul className='flex flex-col gap-6'>
      <li>
        <div className='h-32 p-2 bg-gray-200 md:pr-12 rounded-2xl border border-gray-300 animate-pulse flex items-center gap-4'>
          <div className='w-28 h-28 bg-gray-300 rounded-2xl' />
          <div className='flex-1 flex flex-col justify-center gap-2'>
            <div className='flex items-center gap-0.5'>
              <div className='w-20 h-4 bg-gray-300 rounded' />
              <div className='w-3 h-3 bg-gray-300 rounded-full' />
            </div>
            <div className='w-48 h-6 bg-gray-300 rounded' />
            <div className='w-24 h-4 bg-gray-300 rounded-full' />
          </div>
        </div>
      </li>
    </ul>
  </section>
)

export default AvailableDAOs
