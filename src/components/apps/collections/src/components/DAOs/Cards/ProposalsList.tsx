import React from 'react'
import { Link } from 'react-router-dom'

const ProposalsList = ({ isLoading }) => {
  if (isLoading) return <ProposalsListSkeleton />

  return (
    <section className='h-fit p-6 bg-white rounded-3xl shadow border border-[#e1e1e1] flex flex-col items-center gap-8'>
      {/* Header */}
      <header className='w-full pb-4 border-b border-[#e1e1e1] flex items-center gap-1'>
        <div className='w-6 h-6 p-2.5 bg-[#50be8f] rounded-full flex items-center justify-center text-white text-[13px] font-semibold'>
          6
        </div>
        <h2 className="text-[#212425] text-base font-bold font-['DM Sans']">Active proposals</h2>
      </header>

      {/* Proposal Cards */}
      <div className='w-full flex flex-col md:flex-row gap-4'>
        {/* Proposal #1 */}
        <Link to='/daos/bob/vote/1' className='grow'>
          <article className='p-6 bg-white relative cursor-pointer group rounded-[25px] border border-[#e1e1e1] flex flex-col gap-6 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#f7fcfa] hover:to-[#ebf7f8]'>
            <header className='flex flex-col gap-2'>
              <h3 className="text-[#212425] text-[22px] font-semibold font-['DM Sans']">
                Proposal #1
              </h3>
              <p className="text-[#69737c] text-base font-normal font-['DM Sans']">
                Should we expose the painting at the Tate Museum?
              </p>
            </header>
            <footer className='flex flex-col gap-2'>
              <div className='inline-flex px-2 py-1 bg-[#e5f6ff] rounded-full items-center gap-2.5'>
                <img src='/assets/people.svg' alt='people' className='w-4 h-4' />
                <span className="text-[#00a2f7] text-xs font-bold font-['DM Sans']">1245</span>
              </div>
              <div className='inline-flex px-2 py-1 bg-[#e5f6ff] rounded-full items-center'>
                <span className="text-[#00a2f7] text-xs font-bold font-['DM Sans']">
                  2 hours, 8 minutes remaining
                </span>
              </div>
            </footer>
            <div className='absolute right-0 opacity-0 group-hover:opacity-100 duration-200 transition-all -bottom-[1.3px]'>
              <img src='/assets/arrow_hover.svg' alt='arrow' />
            </div>
          </article>
        </Link>

        {/* Proposal #2 */}
        <article className='grow p-6 bg-white rounded-2xl border border-[#e1e1e1] flex flex-col gap-6'>
          <header className='flex flex-col gap-2'>
            <h3 className="text-[#212425] text-[22px] font-semibold font-['DM Sans']">
              Proposal #2
            </h3>
            <p className="text-[#69737c] text-base font-normal font-['DM Sans']">
              Should we expose the painting at the Tate Museum?
            </p>
          </header>
          <footer className='flex flex-col gap-2'>
            <div className='inline-flex px-2 py-1 bg-[#e5f6ff] rounded-full items-center gap-2.5'>
              <span className="text-[#00a2f7] text-xs font-bold font-['DM Sans']">1245</span>
            </div>
            <div className='inline-flex px-2 py-1 bg-[#e5f6ff] rounded-full items-center'>
              <span className="text-[#00a2f7] text-xs font-bold font-['DM Sans']">
                2 hours, 8 minutes remaining
              </span>
            </div>
          </footer>
        </article>
      </div>
    </section>
  )
}

const ProposalsListSkeleton = () => <div>Loading...</div>

export default ProposalsList
