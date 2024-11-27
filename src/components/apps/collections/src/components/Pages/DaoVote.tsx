import React, { useState } from 'react'
import NavBar from '../NavBar/NavBar'
import DAOCard from '../DAOs/Cards/DaoCard'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchFakeDaos } from '../../data'
import { DAOResponse } from '@dapp/common-types'
import { ConnectWallet, Banner } from '@dapp/features-components'
import ProposalDetails from '../DAOs/Cards/ProposalDetails'

const DaoVote: React.FC = () => {
  const [itemsPerPage] = useState(20)
  const [currentPage] = useState(1)

  const collectionCanisterId = window.location.hash.split('/').pop() || ''

  const { data } = useQuery<DAOResponse, Error>({
    queryKey: ['fetchFakeDaos', currentPage, itemsPerPage],
    queryFn: () => fetchFakeDaos(currentPage, itemsPerPage),
    staleTime: 5 * 60 * 1000,
  })

  const ArrowIcon: React.FC = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='size-5 mr-2 group-hover:-translate-x-1 duration-300 ease-in-out transition-all'
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18' />
    </svg>
  )

  const Header: React.FC<{ allDaos: DAOResponse | undefined; canisterId: string }> = React.memo(
    () => (
      <div className='flex flex-col md:flex-row mt-44 md:mt-16 pb-8 md:px-8 items-center border-b border-mouse md:ml-[88px]'>
        <div className='flex flex-col gap-2'>
          <p className='text-[#222526] text-[40px] font-bold leading-normal'>DAOs</p>
          <Link to={`/daos/bob`}>
            <div className='text-[#212425] text-[10px] font-medium leading-[16px] tracking-[2px] uppercase flex flex-row items-center group'>
              <ArrowIcon />
              Governance / {'Unknown'}
            </div>
          </Link>
        </div>
        <div className='md:ml-auto mt-5 md:mt-0'>
          <ConnectWallet />
        </div>
      </div>
    ),
  )

  Header.displayName = 'Header'

  return (
    <div className='flex flex-row w-full'>
      <NavBar />
      <div className='bg-gray-100 flex flex-col flex-grow items-center min-h-screen w-full'>
        <Banner collectionName={'Unknown'} />
        <div className='w-full'>
          <Header allDaos={data} canisterId={collectionCanisterId} />
        </div>
        <div className='w-[95%]  mt-10 md:w-11/12 md:ml-[88px] relative 3xl:max-w-[90rem]'>
          <div className='flex flex-col xl:flex-row xl:justify-around justify-center mb-10 md:px-0 w-full gap-2 xl:gap-4'>
            <DAOCard isLoading={false} />
            <div className='flex flex-col justify-between gap-2 xl:gap-4 md:px-6'>
              <ProposalDetails isLoading={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DaoVote
