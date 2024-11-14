import React, { useState } from 'react'

const VoteModal = ({ actionType, onClose }) => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const isAdopt = actionType === 'adopt'

  const handleSubmit = () => {
    setIsPending(true)
    setTimeout(() => {
      setIsSubmitted(true)
      setIsPending(false)
    }, 2000)
  }

  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-[#212425] bg-opacity-70 z-50'
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className='w-[400px] h-auto px-5 pt-8 pb-10 bg-white rounded-[20px] border border-[#e1e1e1] flex flex-col items-center gap-5'>
        {isPending ? (
          <div className='my-12 flex flex-col items-center justify-center w-full h-full'>
            <img
              src='/assets/spinner.png'
              alt='Loading spinner'
              className='w-12 h-12 animate-spin my-8'
            />
            <h2 className='text-[22px] font-semibold leading-normal'>Processing</h2>
          </div>
        ) : (
          <>
            <header className='self-stretch flex justify-end'>
              <button onClick={onClose} className='w-6 h-6 text-[#212425]'>
                ✕
              </button>
            </header>

            <div className='flex flex-col items-center'>
              {isSubmitted ? (
                <img src='/assets/tick-circle.svg' alt='Tick circle' className='w-20 h-20 mb-6' />
              ) : isAdopt ? (
                <img src='/assets/adopted.svg' alt='Adopt icon' className='w-20 h-20' />
              ) : (
                <img src='/assets/rejected.svg' alt='Reject icon' className='w-20 h-20' />
              )}
            </div>

            <h2 className='text-center text-[#212425] text-[22px] font-semibold '>
              {isSubmitted ? 'Vote successfully casted' : 'Confirm your vote'}
            </h2>

            {isSubmitted ? (
              <p className='text-center text-[#69737c] text-[13px] font-medium '>
                Your vote has been successfully cast.
              </p>
            ) : (
              <p className='h-[83px] p-4 bg-[#ffe2db] rounded-2xl border border-[#ffa58e] flex flex-col justify-center items-center'>
                <span className='text-[#b53b1d] text-[13px] '>
                  <span className='font-semibold'>
                    Once you cast your votes, you can no longer change it{' '}
                  </span>{' '}
                  unless the NFT was sold to others and they are entitled to vote differently.
                </span>
              </p>
            )}

            <footer className='w-full flex flex-col items-center gap-2'>
              {!isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  className='w-[360px] h-12 px-[25px] bg-[#212425] rounded-full text-white text-sm font-semibold'
                >
                  {isAdopt ? 'Adopt the proposal' : 'Reject the proposal'}
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className='w-[360px] h-12 px-[25px] bg-[#212425] rounded-full mt-2 text-white text-sm font-semibold'
                >
                  Back to proposal
                </button>
              )}
              {!isSubmitted && (
                <button onClick={onClose} className='text-[#69737c] text-[13px] font-normal mt-2'>
                  Back to proposal
                </button>
              )}
            </footer>
          </>
        )}
      </div>
    </div>
  )
}

export default VoteModal
