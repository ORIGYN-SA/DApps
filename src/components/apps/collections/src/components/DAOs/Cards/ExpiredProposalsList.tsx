const ExpiredProposalsList = ({ isLoading }) => {
  return isLoading ? (
    <></>
  ) : (
    <div className='p-4 md:p-6 bg-white rounded-3xl shadow border border-[#e1e1e1]'>
      {/* Header */}
      <div className='w-full pb-4 border-b border-[#e1e1e1]'>
        <div className="text-[#212425] text-base md:text-lg font-bold font-['DM Sans']">
          Expired proposals
        </div>
      </div>

      {/* Mobile View - Cards */}
      <div className='flex flex-col gap-4 md:hidden'>
        <div className="text-[#69737c] text-base font-medium font-['DM Sans']">Top holders</div>

        {/* Cards for each proposal */}
        {[1, 2].map(id => (
          <div
            key={id}
            className='p-4 bg-[#f9f9f9] rounded-lg border border-[#e1e1e1] shadow-sm flex flex-col gap-2'
          >
            <div className='flex justify-between items-center'>
              <div className="text-[#212425] text-sm font-medium font-['DM Sans']">
                {id === 1 ? 'Sell everything and buy an elephant' : 'Example of expired proposals'}
              </div>
              <div className='px-2 py-1 bg-[#e1e1e1] rounded-full text-[#69737c] text-xs font-bold'>
                Expired
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <div className="text-[#69737c] text-sm font-normal font-['DM Sans']">#{id}</div>
              <div className="text-[#69737c] text-sm font-normal font-['DM Sans']">
                {id === 1 ? '20 days ago' : '1 month ago'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tablet/Desktop View - Table */}
      <div className='hidden md:flex flex-col gap-8'>
        <div className="text-[#69737c] text-base font-medium font-['DM Sans']">Top holders</div>

        <div className="w-full p-4 bg-[#212425] rounded-lg flex justify-between items-center text-white text-xs font-bold font-['DM Sans']">
          <div className='w-[30px]'>Nb</div>
          <div className='flex-grow'>Subjects</div>
          <div>Status</div>
          <div>Date</div>
        </div>

        {[1, 2].map(id => (
          <div
            key={id}
            className='w-full px-4 pb-4 border-b border-[#e1e1e1] flex items-center gap-4'
          >
            <div className="text-[#69737c] text-base font-normal font-['DM Sans']">#{id}</div>
            <div className="flex-grow text-[#212425] text-base font-medium font-['DM Sans']">
              {id === 1 ? 'Sell everything and buy an elephant' : 'Example of expired proposals'}
            </div>
            <div className='px-2 py-1 bg-[#e1e1e1] rounded-full text-[#69737c] text-xs font-bold'>
              Expired
            </div>
            <div className="text-[#69737c] text-base font-normal font-['DM Sans']">
              {id === 1 ? '20 days ago' : '1 month ago'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExpiredProposalsList
