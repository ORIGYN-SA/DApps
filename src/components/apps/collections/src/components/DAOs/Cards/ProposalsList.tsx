import React from 'react'
import { Link } from 'react-router-dom'

const fakeData = [
  {
    id: '1',
    title: 'Proposal #1',
    description: 'Should we expose the painting at the Tate Museum?',
    votes: 1245,
    timeRemaining: '2 hours, 8 minutes remaining',
  },
  {
    id: '2',
    title: 'Proposal #2',
    description: 'Should we expose the painting at the Tate Museum?',
    votes: 1245,
    timeRemaining: '2 hours, 8 minutes remaining',
  },
]

const ProposalsList = ({ isLoading }) => (
  <section className='h-fit p-6 bg-white rounded-3xl shadow border border-[#e1e1e1] flex flex-col items-center gap-8'>
    {/* Header */}
    <header className='w-full pb-4 border-b border-[#e1e1e1] flex items-center gap-1'>
      <div className='w-6 h-6 p-2.5 bg-[#50be8f] rounded-full flex items-center justify-center text-white text-[13px] font-semibold'>
        {fakeData.length}
      </div>
      <h2 className='text-[#212425] text-base font-bold '>Active proposals</h2>
    </header>

    {/* Proposal Cards */}
    <div className='w-full flex flex-col md:flex-row gap-4 '>
      {isLoading
        ? fakeData.map((_, index) => <ProposalCardSkeleton key={index} />)
        : fakeData.map(proposal => (
            <ProposalCard
              key={proposal.id}
              id={proposal.id}
              title={proposal.title}
              description={proposal.description}
              votes={proposal.votes}
              timeRemaining={proposal.timeRemaining}
            />
          ))}
    </div>
  </section>
)

const ProposalCard = ({ id, title, description, votes, timeRemaining }) => (
  <Link to={`/daos/bob/vote/${id}`} className='grow'>
    <article className='p-6 bg-white relative max-w-[400px] cursor-pointer group rounded-[25px] border border-[#e1e1e1] flex flex-col gap-6 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#f7fcfa] hover:to-[#ebf7f8]'>
      <header className='flex flex-col gap-2'>
        <h3 className='text-[#212425] text-[22px] font-semibold '>{title}</h3>
        <p className='text-[#69737c] text-base font-normal '>{description}</p>
      </header>
      <footer className='flex flex-col gap-2'>
        <div className='inline-flex px-2 py-1 bg-[#e5f6ff] rounded-full items-center gap-2.5 w-fit'>
          <img src='/assets/people.svg' alt='people' className='w-4 h-4' />
          <span className='text-[#00a2f7] text-xs font-bold '>{votes}</span>
        </div>
        <div className='inline-flex px-2 py-1 bg-[#e5f6ff] rounded-full items-center w-fit'>
          <span className='text-[#00a2f7] text-xs font-bold '>{timeRemaining}</span>
        </div>
      </footer>
      <div className='absolute right-0 opacity-0 group-hover:opacity-100 duration-200 transition-all -bottom-[1.3px]'>
        <img src='/assets/arrow_hover.svg' alt='arrow' />
      </div>
    </article>
  </Link>
)

const ProposalCardSkeleton = () => (
  <div className='grow p-6 bg-gray-200 w-[400px] rounded-2xl border border-gray-300 animate-pulse flex flex-col gap-6'>
    <div className='flex flex-col gap-2'>
      <div className='w-3/4 h-6 bg-gray-300 rounded' />
      <div className='w-full h-4 bg-gray-300 rounded' />
    </div>
    <footer className='flex flex-col gap-2'>
      <div className='inline-flex px-2 py-1 bg-gray-300 rounded-full w-24 h-6' />
      <div className='inline-flex px-2 py-1 bg-gray-300 rounded-full w-32 h-6' />
    </footer>
  </div>
)

export default ProposalsList
