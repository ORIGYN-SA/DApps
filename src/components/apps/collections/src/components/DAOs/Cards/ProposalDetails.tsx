import React from 'react'

const ProposalDetails = ({ isLoading }) => {
  if (isLoading) return null

  return (
    <div className='flex flex-col gap-4'>
      <ProposalLayout />
      <Instructions />
    </div>
  )
}

const ProposalLayout = () => (
  <div className='h-auto p-6 bg-white rounded-3xl border border-[#e1e1e1] flex flex-col gap-8'>
    <ProposalHeader
      id={2}
      title='Should we expose the painting at the Tate Museum?'
      timeRemaining='5 days remaining'
    />
    <StatusSection adoptPercentage={65} rejectPercentage={35} />
    <ActionButtons />
  </div>
)

const ProposalHeader = ({ id, title, timeRemaining }) => (
  <div className='flex justify-between items-start border-b border-[#e1e1e1] pb-4'>
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-2'>
        <img src='/assets/invoice.svg' alt='icon' className='w-4 h-4' />
        <h2 className='text-lg font-semibold text-[#212425]'>Proposal #{id}</h2>
      </div>
      <p className='text-[22px] font-light text-[#69737c]'>{title}</p>
    </div>
    <div className='px-2 py-1 bg-[#ffe2db] md:w-1/4 xl:w-fit text-center rounded-full text-xs font-bold text-[#e84c25]'>
      {timeRemaining}
    </div>
  </div>
)

const StatusSection = ({ adoptPercentage, rejectPercentage }) => (
  <div className='p-6 bg-white rounded-2xl border border-[#e1e1e1] flex flex-col gap-4'>
    <StatusDisplay label='Status' value='1,228,837,710' />
    <ProgressBar adoptPercentage={adoptPercentage} rejectPercentage={rejectPercentage} />
    <PercentageDisplay adoptPercentage={adoptPercentage} rejectPercentage={rejectPercentage} />
  </div>
)

const StatusDisplay = ({ label, value }) => (
  <div className='flex flex-col'>
    <span className='text-base font-semibold text-[#69737c]'>{label}</span>
    <span className='text-[40px] font-bold text-[#212425]'>{value}</span>
  </div>
)

const ProgressBar = ({ adoptPercentage, rejectPercentage }) => (
  <div className='w-full h-4 bg-[#e9ecf5] rounded-full relative overflow-hidden'>
    <div className='h-full bg-[#50be8f]' style={{ width: `${adoptPercentage}%` }} />
    <div
      className='h-full bg-[#e84c25] absolute top-0'
      style={{ left: `${adoptPercentage}%`, width: `${rejectPercentage}%` }}
    />
  </div>
)

const PercentageDisplay = ({ adoptPercentage, rejectPercentage }) => (
  <div className='flex justify-between'>
    <PercentageLabel percentage={adoptPercentage} label='Adopt' color='#50be8f' />
    <PercentageLabel percentage={rejectPercentage} label='Reject' color='#e84c25' />
  </div>
)

const PercentageLabel = ({ percentage, label, color }) => (
  <div className='flex items-center gap-2'>
    {label === 'Adopt' && <img src='/assets/adopted.svg' alt='icon' className='w-12 h-12' />}
    {label === 'Reject' && <img src='/assets/rejected.svg' alt='icon' className='w-12 h-12' />}
    <div className='flex flex-col'>
      <span className='text-[22px] font-semibold text-[#69737c]'>{percentage}%</span>
      <span className='text-xs font-medium text-[#69737c] uppercase tracking-widest'>{label}</span>
    </div>
  </div>
)

const ActionButtons = () => (
  <div className='flex gap-4'>
    <ActionButton label='Adopt the proposal' />
    <ActionButton label='Reject the proposal' />
  </div>
)

const ActionButton = ({ label }) => (
  <button className='px-6 py-2 bg-[#212425] rounded-full text-white text-sm font-semibold'>
    {label}
  </button>
)

const Instructions = () => (
  <div className='flex flex-col'>
    <div className='p-6 bg-white rounded-tl-3xl rounded-tr-3xl border border-[#e1e1e1] flex flex-col gap-4'>
      <h3 className='text-lg font-semibold text-[#212425]'>Instructions</h3>
      <InstructionStep number={1} text='Login with your wallet' />
      <InstructionStep
        number={2}
        text='If you have one or more NFTs of the collection, you will be able to vote. Each NFT has one vote power. Eg. if you own 2 NFTs, you have 2 votes.'
      />
      <InstructionStep number={3} text='Select the answer that you want to vote' />
      <InstructionStep number={4} text='Wait for the end of the voting period to see the result' />
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

export default ProposalDetails
