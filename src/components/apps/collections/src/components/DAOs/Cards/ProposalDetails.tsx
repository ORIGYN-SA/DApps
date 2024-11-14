import React, { useState } from 'react'
import VoteModal from '../../Modals/VoteModal'

const fakeProposalData = {
  id: 2,
  title: 'Should we expose the painting at the Tate Museum?',
  statusValue: '1,228,837,710',
  adoptPercentage: 65,
  rejectPercentage: 35,
  timeRemaining: '5 days remaining',
}

const ProposalDetails = ({ isLoading }) => {
  const [modalType, setModalType] = useState(null)

  const openModal = type => setModalType(type)
  const closeModal = () => setModalType(null)

  return (
    <div className='flex flex-col gap-4'>
      {isLoading ? <ProposalSkeleton /> : <Proposal openModal={openModal} />}
      {isLoading ? <InstructionsSkeleton /> : <Instructions />}
      {modalType && <VoteModal actionType={modalType} onClose={closeModal} />}
    </div>
  )
}

// Proposal Component
const Proposal = ({ openModal }) => (
  <div className='h-auto p-6 bg-white rounded-3xl border border-[#e1e1e1] flex flex-col gap-8'>
    <header className='flex justify-between items-start border-b border-[#e1e1e1] pb-4'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <img src='/assets/invoice.svg' alt='icon' className='w-4 h-4' />
          <h2 className='text-lg font-semibold text-[#212425]'>Proposal #{fakeProposalData.id}</h2>
        </div>
        <p className='text-[22px] font-light text-[#69737c]'>{fakeProposalData.title}</p>
      </div>
      <div className='px-2 py-1 bg-[#ffe2db] md:w-1/4 xl:w-fit text-center rounded-full text-xs font-bold text-[#e84c25]'>
        {fakeProposalData.timeRemaining}
      </div>
    </header>

    <div className='p-6 bg-white rounded-2xl border border-[#e1e1e1] flex flex-col gap-4'>
      <div className='flex flex-col'>
        <span className='text-base font-semibold text-[#69737c]'>Status</span>
        <span className='text-[40px] font-bold text-[#212425]'>{fakeProposalData.statusValue}</span>
      </div>
      <div className='w-full h-4 bg-[#e9ecf5] rounded-full relative overflow-hidden'>
        <div
          className='h-full bg-[#50be8f]'
          style={{ width: `${fakeProposalData.adoptPercentage}%` }}
        />
        <div
          className='h-full bg-[#e84c25] absolute top-0'
          style={{
            left: `${fakeProposalData.adoptPercentage}%`,
            width: `${fakeProposalData.rejectPercentage}%`,
          }}
        />
      </div>
      <div className='flex justify-between'>
        <StatusItem
          label='Adopt'
          percentage={fakeProposalData.adoptPercentage}
          color='#50be8f'
          iconSrc='/assets/adopted.svg'
        />
        <StatusItem
          label='Reject'
          percentage={fakeProposalData.rejectPercentage}
          color='#e84c25'
          iconSrc='/assets/rejected.svg'
        />
      </div>
    </div>

    <div className='flex gap-4'>
      <ActionButton label='Adopt the proposal' onClick={() => openModal('adopt')} />
      <ActionButton label='Reject the proposal' onClick={() => openModal('reject')} />
    </div>
  </div>
)

const StatusItem = ({ label, percentage, color, iconSrc }) => (
  <div className='flex items-center gap-2'>
    <img src={iconSrc} alt={`${label} icon`} className='w-12 h-12' />
    <div className='flex flex-col'>
      <span className='text-[22px] font-semibold text-[#69737c]'>{percentage}%</span>
      <span className='text-xs font-medium text-[#69737c] uppercase tracking-widest'>{label}</span>
    </div>
  </div>
)

const ActionButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className='px-6 py-2 bg-[#212425] rounded-full text-white text-sm font-semibold'
  >
    {label}
  </button>
)

// Instructions Component
const Instructions = () => (
  <div className='flex flex-col'>
    <div className='p-6 bg-white rounded-tl-3xl rounded-tr-3xl border border-[#e1e1e1] flex flex-col gap-4'>
      <h3 className='text-lg font-semibold text-[#212425]'>Instructions</h3>
      {[
        'Login with your wallet',
        'If you have one or more NFTs of the collection, you will be able to vote. Each NFT has one vote power. Eg. if you own 2 NFTs, you have 2 votes.',
        'Select the answer that you want to vote',
        'Wait for the end of the voting period to see the result',
      ].map((text, index) => (
        <InstructionStep key={index} number={index + 1} text={text} />
      ))}
    </div>
    <FooterMessage />
  </div>
)

const InstructionStep = ({ number, text }) => (
  <div className='flex gap-2 items-center'>
    <span className='px-2 py-1 bg-[#e1e1e1] w-fit rounded-full text-xs font-bold text-[#69737c]'>
      Step {number}
    </span>
    <p className='text-[13px] text-[#69737c] w-3/4'>{text}</p>
  </div>
)

const FooterMessage = () => (
  <div className='p-4 bg-[#f9fafe] rounded-bl-2xl rounded-br-2xl border border-[#e1e1e1] text-xs font-medium text-[#69737c]'>
    Once you cast your votes, you can no longer change them unless the NFT is sold.
  </div>
)

// Proposal Skeleton
const ProposalSkeleton = () => (
  <div className='h-auto p-6 bg-white rounded-3xl border border-[#e1e1e1] flex flex-col gap-8 animate-pulse'>
    <header className='flex justify-between items-start border-b border-[#e1e1e1] pb-4'>
      <div className='flex flex-col gap-2'>
        <div className='w-20 h-6 bg-gray-300 rounded' />
        <div className='w-48 h-8 bg-gray-300 rounded mt-2' />
      </div>
      <div className='w-24 h-6 bg-gray-300 rounded-full' />
    </header>
    <div className='p-6 bg-white rounded-2xl border border-[#e1e1e1] flex flex-col gap-4'>
      <div className='w-48 h-8 bg-gray-300 rounded mt-2' />
      <div className='w-full h-4 bg-gray-300 rounded-full' />
      <div className='flex justify-between'>
        <div className='flex gap-2 items-center'>
          <div className='w-12 h-12 bg-gray-300 rounded-full' />
          <div className='w-16 h-6 bg-gray-300 rounded' />
        </div>
        <div className='flex gap-2 items-center'>
          <div className='w-12 h-12 bg-gray-300 rounded-full' />
          <div className='w-16 h-6 bg-gray-300 rounded' />
        </div>
      </div>
    </div>
    <div className='flex gap-4'>
      <div className='w-36 h-10 bg-gray-300 rounded-full' />
      <div className='w-36 h-10 bg-gray-300 rounded-full' />
    </div>
  </div>
)

// Instructions Skeleton
const InstructionsSkeleton = () => (
  <div className='flex flex-col animate-pulse'>
    <div className='p-6 bg-white min-w-[800px] rounded-tl-3xl rounded-tr-3xl border border-[#e1e1e1] flex flex-col gap-4'>
      <div className='w-32 h-6 bg-gray-300 rounded' />
      {[...Array(4)].map((_, index) => (
        <div key={index} className='flex gap-2 items-center'>
          <div className='w-16 h-6 bg-gray-300 rounded-full' />
          <div className='w-3/4 h-4 bg-gray-300 rounded' />
        </div>
      ))}
    </div>
    <div className='p-4 bg-[#f9fafe] rounded-bl-2xl rounded-br-2xl border border-[#e1e1e1] text-xs font-medium'>
      <div className='w-3/4 h-4 bg-gray-300 rounded' />
    </div>
  </div>
)

export default ProposalDetails
