import React from 'react'

const fakeData = [
  {
    id: 1,
    title: 'Sell everything and buy an elephant',
    status: 'Expired',
    date: '20 days ago',
  },
  {
    id: 2,
    title: 'Example of expired proposals',
    status: 'Expired',
    date: '1 month ago',
  },
]

const ExpiredProposalsList = ({ isLoading }) => (
  <div className='p-4 md:p-6 bg-white rounded-3xl shadow border border-[#e1e1e1]'>
    {/* Header */}
    <header className='w-full pb-2 border-b border-[#e1e1e1]'>
      <h2 className='text-[#212425] text-base md:text-lg font-bold '>Expired proposals</h2>
    </header>

    {/* Mobile View - Display cards for each proposal */}
    <section className='flex flex-col gap-4 pt-2 md:hidden'>
      <h3 className='text-[#69737c] text-base font-medium '>Top holders</h3>

      {isLoading
        ? [1, 2].map(index => <ExpiredProposalCardSkeleton key={index} />)
        : fakeData.map(proposal => (
            <ExpiredProposalCard
              key={proposal.id}
              title={proposal.title}
              status={proposal.status}
              id={proposal.id}
              date={proposal.date}
            />
          ))}
    </section>

    {/* Tablet/Desktop View - Display proposals in a table format */}
    <section className='hidden md:flex flex-col'>
      <h3 className='text-[#69737c] text-base font-medium py-4'>Top holders</h3>

      {/* Table header */}
      <div className='w-full p-4 bg-[#212425] rounded-lg flex justify-between items-center text-white text-xs font-bold '>
        <span className='w-[30px]'>Nb</span>
        <span className='flex-grow'>Subjects</span>
        <span>Status</span>
        <span>Date</span>
      </div>

      {/* Table rows for each proposal */}
      {isLoading
        ? [1, 2].map(index => <ExpiredProposalCardSkeleton key={index} />)
        : fakeData.map(proposal => (
            <article
              key={proposal.id}
              className='w-full px-4 hover:bg-[#b7bbd51d] duration-200 py-6 pb-4 border-b border-[#e1e1e1] flex items-center gap-4'
            >
              <span className='text-[#69737c] text-base font-normal '>#{proposal.id}</span>
              <p className='flex-grow text-[#212425] text-base font-medium '>{proposal.title}</p>
              <span className='px-2 py-1 bg-[#e1e1e1] rounded-full text-[#69737c] text-xs font-bold'>
                {proposal.status}
              </span>
              <span className='text-[#69737c] text-base font-normal '>{proposal.date}</span>
            </article>
          ))}
    </section>
  </div>
)

const ExpiredProposalCard = ({ title, status, id, date }) => (
  <article className='p-4 bg-[#f9f9f9] rounded-lg border border-[#e1e1e1] shadow-sm flex flex-col gap-2'>
    <div className='flex justify-between items-center'>
      <p className='text-[#212425] text-sm font-medium w-3/4'>{title}</p>
      <span className='px-2 py-1 bg-[#e1e1e1] rounded-full text-[#69737c] text-xs font-bold'>
        {status}
      </span>
    </div>
    <div className='flex justify-between items-center'>
      <span className='text-[#69737c] text-sm font-normal '>#{id}</span>
      <span className='text-[#69737c] text-sm font-normal '>{date}</span>
    </div>
  </article>
)

const ExpiredProposalCardSkeleton = () => (
  <article className='p-3 bg-gray-200 rounded-lg border border-gray-300 animate-pulse flex flex-col gap-1 mb-1'>
    <div className='flex justify-between items-center'>
      <div className='w-3/4 h-4 bg-gray-300 rounded'></div>
      <div className='w-16 h-6 bg-gray-300 rounded-full'></div>
    </div>
    <div className='flex justify-between items-center'>
      <div className='w-8 h-4 bg-gray-300 rounded'></div>
      <div className='w-16 h-4 bg-gray-300 rounded'></div>
    </div>
  </article>
)

export default ExpiredProposalsList
