import React from 'react'
const ProposalsList = ({ isLoading }) => {
  return isLoading ? (
    <ProposalsListSkeleton />
  ) : (
    <div className='w-[797px] h-[800px] p-6 bg-white rounded-3xl shadow border border-[#e1e1e1] flex-col justify-center items-center gap-8 inline-flex'>
      <div className='self-stretch pb-4 border-b border-[#e1e1e1] justify-start items-start inline-flex'>
        <div className='h-6 justify-start items-center gap-1 flex'>
          <div className='w-6 h-6 p-2.5 bg-[#50be8f] rounded-[100px] flex-col justify-center items-center gap-2.5 inline-flex'>
            <div className="text-white text-[13px] font-semibold font-['DM Sans'] leading-none">
              6
            </div>
          </div>
          <div className="text-[#212425] text-base font-bold font-['DM Sans']">
            Active proposals
          </div>
        </div>
      </div>
      <div className='self-stretch h-[680px] flex-col justify-start items-start gap-4 flex'>
        <div className='self-stretch justify-start items-start gap-4 inline-flex'>
          <div className='grow shrink basis-0 p-6 bg-white rounded-2xl border border-[#e1e1e1] flex-col justify-center items-start gap-6 inline-flex'>
            <div className='self-stretch h-[88px] flex-col justify-center items-start gap-2 flex'>
              <div className="self-stretch grow shrink basis-0 text-[#212425] text-[22px] font-semibold font-['DM Sans']">
                Proposal #1
              </div>
              <div className="self-stretch text-[#69737c] text-base font-normal font-['DM Sans'] leading-normal">
                Should we expose the painting at the Tate Museum?
              </div>
            </div>
            <div className='h-14 flex-col justify-start items-start gap-2 flex'>
              <div className='px-2 py-1 bg-[#e5f6ff] rounded-[100px] justify-center items-center gap-2.5 inline-flex'>
                <div className='w-4 h-4 justify-center items-center flex'>
                  <div className='w-4 h-4 relative'>
                    <div className='w-[4.43px] h-[8.35px] left-[10.22px] top-[1.33px] absolute'></div>
                    <div className='w-[4.42px] h-[8.35px] left-[1.34px] top-[1.33px] absolute'></div>
                    <div className='w-[5.29px] h-[8.35px] left-[5.36px] top-[6.31px] absolute'></div>
                  </div>
                </div>
                <div className="text-[#00a2f7] text-xs font-bold font-['DM Sans'] leading-none">
                  1245
                </div>
              </div>
              <div className='self-stretch px-2 py-1 bg-[#e5f6ff] rounded-[100px] justify-center items-center gap-2.5 inline-flex'>
                <div className="text-[#00a2f7] text-xs font-bold font-['DM Sans'] leading-none">
                  2 hours, 8 minutes remaining
                </div>
              </div>
            </div>
          </div>
          <div className='grow shrink basis-0 p-6 bg-white rounded-2xl border border-[#e1e1e1] flex-col justify-center items-start gap-6 inline-flex'>
            <div className='self-stretch h-[88px] flex-col justify-center items-start gap-2 flex'>
              <div className="self-stretch grow shrink basis-0 text-[#212425] text-[22px] font-semibold font-['DM Sans']">
                Proposal #2
              </div>
              <div className="self-stretch text-[#69737c] text-base font-normal font-['DM Sans'] leading-normal">
                Should we expose the painting at the Tate Museum?
              </div>
            </div>
            <div className='h-14 flex-col justify-start items-start gap-2 flex'>
              <div className='px-2 py-1 bg-[#e5f6ff] rounded-[100px] justify-center items-center gap-2.5 inline-flex'>
                <div className='w-4 h-4 justify-center items-center flex'>
                  <div className='w-4 h-4 relative'>
                    <div className='w-[4.43px] h-[8.35px] left-[10.22px] top-[1.33px] absolute'></div>
                    <div className='w-[4.42px] h-[8.35px] left-[1.34px] top-[1.33px] absolute'></div>
                    <div className='w-[5.29px] h-[8.35px] left-[5.36px] top-[6.31px] absolute'></div>
                  </div>
                </div>
                <div className="text-[#00a2f7] text-xs font-bold font-['DM Sans'] leading-none">
                  1245
                </div>
              </div>
              <div className='self-stretch px-2 py-1 bg-[#e5f6ff] rounded-[100px] justify-center items-center gap-2.5 inline-flex'>
                <div className="text-[#00a2f7] text-xs font-bold font-['DM Sans'] leading-none">
                  2 hours, 8 minutes remaining
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='self-stretch justify-start items-start gap-4 inline-flex'>
          <div className='grow shrink basis-0 p-6 bg-white rounded-2xl border border-[#e1e1e1] flex-col justify-center items-start gap-6 inline-flex'>
            <div className='self-stretch h-[88px] flex-col justify-center items-start gap-2 flex'>
              <div className="self-stretch grow shrink basis-0 text-[#212425] text-[22px] font-semibold font-['DM Sans']">
                Proposal #1
              </div>
              <div className="self-stretch text-[#69737c] text-base font-normal font-['DM Sans'] leading-normal">
                Should we expose the painting at the Tate Museum?
              </div>
            </div>
            <div className='h-14 flex-col justify-start items-start gap-2 flex'>
              <div className='px-2 py-1 bg-[#e5f6ff] rounded-[100px] justify-center items-center gap-2.5 inline-flex'>
                <div className='w-4 h-4 justify-center items-center flex'>
                  <div className='w-4 h-4 relative'>
                    <div className='w-[4.43px] h-[8.35px] left-[10.22px] top-[1.33px] absolute'></div>
                    <div className='w-[4.42px] h-[8.35px] left-[1.34px] top-[1.33px] absolute'></div>
                    <div className='w-[5.29px] h-[8.35px] left-[5.36px] top-[6.31px] absolute'></div>
                  </div>
                </div>
                <div className="text-[#00a2f7] text-xs font-bold font-['DM Sans'] leading-none">
                  1245
                </div>
              </div>
              <div className='self-stretch px-2 py-1 bg-[#e5f6ff] rounded-[100px] justify-center items-center gap-2.5 inline-flex'>
                <div className="text-[#00a2f7] text-xs font-bold font-['DM Sans'] leading-none">
                  2 hours, 8 minutes remaining
                </div>
              </div>
            </div>
          </div>
          <div className='grow shrink basis-0 p-6 bg-white rounded-2xl border border-[#e1e1e1] flex-col justify-center items-start gap-6 inline-flex'>
            <div className='self-stretch h-[88px] flex-col justify-center items-start gap-2 flex'>
              <div className="self-stretch grow shrink basis-0 text-[#212425] text-[22px] font-semibold font-['DM Sans']">
                Proposal #2
              </div>
              <div className="self-stretch text-[#69737c] text-base font-normal font-['DM Sans'] leading-normal">
                Should we expose the painting at the Tate Museum?
              </div>
            </div>
            <div className='h-14 flex-col justify-start items-start gap-2 flex'>
              <div className='px-2 py-1 bg-[#e5f6ff] rounded-[100px] justify-center items-center gap-2.5 inline-flex'>
                <div className='w-4 h-4 justify-center items-center flex'>
                  <div className='w-4 h-4 relative'>
                    <div className='w-[4.43px] h-[8.35px] left-[10.22px] top-[1.33px] absolute'></div>
                    <div className='w-[4.42px] h-[8.35px] left-[1.34px] top-[1.33px] absolute'></div>
                    <div className='w-[5.29px] h-[8.35px] left-[5.36px] top-[6.31px] absolute'></div>
                  </div>
                </div>
                <div className="text-[#00a2f7] text-xs font-bold font-['DM Sans'] leading-none">
                  1245
                </div>
              </div>
              <div className='self-stretch px-2 py-1 bg-[#e5f6ff] rounded-[100px] justify-center items-center gap-2.5 inline-flex'>
                <div className="text-[#00a2f7] text-xs font-bold font-['DM Sans'] leading-none">
                  2 hours, 8 minutes remaining
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='self-stretch justify-start items-start gap-4 inline-flex'>
          <div className='grow shrink basis-0 p-6 bg-white rounded-2xl border border-[#e1e1e1] flex-col justify-center items-start gap-6 inline-flex'>
            <div className='self-stretch h-[88px] flex-col justify-center items-start gap-2 flex'>
              <div className="self-stretch grow shrink basis-0 text-[#212425] text-[22px] font-semibold font-['DM Sans']">
                Proposal #1
              </div>
              <div className="self-stretch text-[#69737c] text-base font-normal font-['DM Sans'] leading-normal">
                Should we expose the painting at the Tate Museum?
              </div>
            </div>
            <div className='h-14 flex-col justify-start items-start gap-2 flex'>
              <div className='px-2 py-1 bg-[#e5f6ff] rounded-[100px] justify-center items-center gap-2.5 inline-flex'>
                <div className='w-4 h-4 justify-center items-center flex'>
                  <div className='w-4 h-4 relative'>
                    <div className='w-[4.43px] h-[8.35px] left-[10.22px] top-[1.33px] absolute'></div>
                    <div className='w-[4.42px] h-[8.35px] left-[1.34px] top-[1.33px] absolute'></div>
                    <div className='w-[5.29px] h-[8.35px] left-[5.36px] top-[6.31px] absolute'></div>
                  </div>
                </div>
                <div className="text-[#00a2f7] text-xs font-bold font-['DM Sans'] leading-none">
                  1245
                </div>
              </div>
              <div className='self-stretch px-2 py-1 bg-[#e5f6ff] rounded-[100px] justify-center items-center gap-2.5 inline-flex'>
                <div className="text-[#00a2f7] text-xs font-bold font-['DM Sans'] leading-none">
                  2 hours, 8 minutes remaining
                </div>
              </div>
            </div>
          </div>
          <div className='grow shrink basis-0 p-6 bg-white rounded-2xl border border-[#e1e1e1] flex-col justify-center items-start gap-6 inline-flex'>
            <div className='self-stretch h-[88px] flex-col justify-center items-start gap-2 flex'>
              <div className="self-stretch grow shrink basis-0 text-[#212425] text-[22px] font-semibold font-['DM Sans']">
                Proposal #2
              </div>
              <div className="self-stretch text-[#69737c] text-base font-normal font-['DM Sans'] leading-normal">
                Should we expose the painting at the Tate Museum?
              </div>
            </div>
            <div className='h-14 flex-col justify-start items-start gap-2 flex'>
              <div className='px-2 py-1 bg-[#e5f6ff] rounded-[100px] justify-center items-center gap-2.5 inline-flex'>
                <div className='w-4 h-4 justify-center items-center flex'>
                  <div className='w-4 h-4 relative'>
                    <div className='w-[4.43px] h-[8.35px] left-[10.22px] top-[1.33px] absolute'></div>
                    <div className='w-[4.42px] h-[8.35px] left-[1.34px] top-[1.33px] absolute'></div>
                    <div className='w-[5.29px] h-[8.35px] left-[5.36px] top-[6.31px] absolute'></div>
                  </div>
                </div>
                <div className="text-[#00a2f7] text-xs font-bold font-['DM Sans'] leading-none">
                  1245
                </div>
              </div>
              <div className='self-stretch px-2 py-1 bg-[#e5f6ff] rounded-[100px] justify-center items-center gap-2.5 inline-flex'>
                <div className="text-[#00a2f7] text-xs font-bold font-['DM Sans'] leading-none">
                  2 hours, 8 minutes remaining
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalsList

const ProposalsListSkeleton = () => <></>
