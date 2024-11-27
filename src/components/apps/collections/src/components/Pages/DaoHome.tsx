import React, { useState } from 'react'
import NavBar from '../NavBar/NavBar'
import { useQuery } from '@tanstack/react-query'
import { fetchFakeDaos } from '../../data'
import { DAOResponse } from '@dapp/common-types'
import { ConnectWallet, Banner } from '@dapp/features-components'
import AvailableDAOs from '../DAOs/Cards/AvailableDAOs'

const DaoHome: React.FC = () => {
  const [itemsPerPage] = useState(20)
  const [currentPage] = useState(1)

  const collectionCanisterId = window.location.hash.split('/').pop() || ''

  const { data } = useQuery<DAOResponse, Error>({
    queryKey: ['fetchFakeDaos', currentPage, itemsPerPage],
    queryFn: () => fetchFakeDaos(currentPage, itemsPerPage),
    staleTime: 5 * 60 * 1000,
  })

  const Header: React.FC<{ allDaos: DAOResponse | undefined; canisterId: string }> = React.memo(
    () => (
      <div className='flex flex-col md:flex-row mt-44 md:mt-16 pb-8 md:px-8 items-center border-b border-mouse md:ml-[88px]'>
        <div className='flex flex-col gap-2 px-6'>
          <p className='text-[#222526] text-[40px] font-bold leading-normal'>Governance</p>
          <div className='text-[#212425] text-[10px] font-medium leading-[16px] tracking-[2px] uppercase flex flex-row items-center group'>
            Little description to talk about this section?
          </div>
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
          <AvailableDAOs isLoading={false} />
        </div>
      </div>
    </div>
  )
}

export default DaoHome
