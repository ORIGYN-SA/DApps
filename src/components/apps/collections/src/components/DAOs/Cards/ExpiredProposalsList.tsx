import React from 'react'

const ExpiredProposalsList = ({ isLoading }) => {
  if (isLoading) return null

  return (
    <div className='p-4 md:p-6 bg-white rounded-3xl shadow border border-[#e1e1e1]'>
      {/* Header */}
      <header className='w-full pb-2 border-b border-[#e1e1e1]'>
        <h2 className="text-[#212425] text-base md:text-lg font-bold font-['DM Sans']">
          Expired proposals
        </h2>
      </header>

      {/* Mobile View - Display cards for each proposal */}
      <section className='flex flex-col gap-4 pt-2 md:hidden'>
        <h3 className="text-[#69737c] text-base font-medium font-['DM Sans']">Top holders</h3>

        {[1, 2].map(id => (
          <article
            key={id}
            className='p-4 bg-[#f9f9f9] rounded-lg border border-[#e1e1e1] shadow-sm flex flex-col gap-2'
          >
            {/* Proposal title and status */}
            <div className='flex justify-between items-center'>
              <p className="text-[#212425] text-sm font-medium font-['DM Sans'] w-3/4">
                {id === 1 ? 'Sell everything and buy an elephant' : 'Example of expired proposals'}
              </p>
              <span className='px-2 py-1 bg-[#e1e1e1] rounded-full text-[#69737c] text-xs font-bold'>
                Expired
              </span>
            </div>

            {/* Proposal ID and date */}
            <div className='flex justify-between items-center'>
              <span className="text-[#69737c] text-sm font-normal font-['DM Sans']">#{id}</span>
              <span className="text-[#69737c] text-sm font-normal font-['DM Sans']">
                {id === 1 ? '20 days ago' : '1 month ago'}
              </span>
            </div>
          </article>
        ))}
      </section>

      {/* Tablet/Desktop View - Display proposals in a table format */}
      <section className='hidden md:flex flex-col gap-8'>
        <h3 className="text-[#69737c] text-base font-medium font-['DM Sans']">Top holders</h3>

        {/* Table header */}
        <div className="w-full p-4 bg-[#212425] rounded-lg flex justify-between items-center text-white text-xs font-bold font-['DM Sans']">
          <span className='w-[30px]'>Nb</span>
          <span className='flex-grow'>Subjects</span>
          <span>Status</span>
          <span>Date</span>
        </div>

        {/* Table rows for each proposal */}
        {[1, 2].map(id => (
          <article
            key={id}
            className='w-full px-4 pb-4 border-b border-[#e1e1e1] flex items-center gap-4'
          >
            {/* Proposal ID */}
            <span className="text-[#69737c] text-base font-normal font-['DM Sans']">#{id}</span>

            {/* Proposal title */}
            <p className="flex-grow text-[#212425] text-base font-medium font-['DM Sans']">
              {id === 1 ? 'Sell everything and buy an elephant' : 'Example of expired proposals'}
            </p>

            {/* Proposal status */}
            <span className='px-2 py-1 bg-[#e1e1e1] rounded-full text-[#69737c] text-xs font-bold'>
              Expired
            </span>

            {/* Proposal date */}
            <span className="text-[#69737c] text-base font-normal font-['DM Sans']">
              {id === 1 ? '20 days ago' : '1 month ago'}
            </span>
          </article>
        ))}
      </section>
    </div>
  )
}

export default ExpiredProposalsList
