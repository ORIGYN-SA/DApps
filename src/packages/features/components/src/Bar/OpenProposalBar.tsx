import React from 'react'

const OpenProposalBar = ({ totalAvatars: totalAvatars }: { totalAvatars: number }) => {
  const shownAvatars = totalAvatars > 3 ? 3 : totalAvatars
  const extraAvatarsCount = totalAvatars > 3 ? totalAvatars - 3 : 0

  return (
    <div className='relative w-full mx-auto'>
      <div
        className={`bg-white text-slate-700 font-semibold border rounded-full
            border-gray-300 p-2 h-[50px] w-full flex px-2 justify-between items-center`}
      >
        <div className='flex items-center gap-2'>
          <div className='relative w-9 h-9 flex items-center justify-center'>
            <div className='absolute inset-0 bg-[#50be8f] rounded-full border border-white flex items-center justify-center'>
              <span className='text-white text-base font-bold'>10</span>
            </div>
          </div>
          <div className='text-[#212425]'>Open proposals</div>
        </div>
        <div className='w-[90px] h-8 relative'>
          {Array.from({ length: shownAvatars }).map((_, index) => (
            <img
              key={index}
              className={`w-9 h-9 rounded-full border hover:opacity-90 border-[#d0d3e0] absolute`}
              src={`https://via.placeholder.com/150`}
              alt={`DAO ${index + 1}`}
              style={{ left: `${index * 18}px` }}
            />
          ))}
          {extraAvatarsCount > 0 && (
            <div
              className='absolute w-9 h-9 flex items-center justify-center'
              style={{ left: `${shownAvatars * 18}px` }}
            >
              <div className='bg-[#69737c] rounded-full hover:opacity-90 border border-white flex items-center justify-center w-full h-full'>
                <span className='text-white text-xs font-extrabold'>+{extraAvatarsCount}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OpenProposalBar
