import React, { useState, useEffect } from 'react'
import '../../index.css'
import DAOsList from '../DAOs/DAOsList'
import { fetchFakeDaos } from '../../data'
import { useQuery } from '@tanstack/react-query'
import { DAOResponse, DAOType } from '@dapp/common-types'
import { Header, OpenProposalBar, SearchBar } from '@dapp/features-components'
import Presentation from '../Presentation/Presentation'
import { CheckboxBar } from '@dapp/features-components'

const Daos: React.FC = () => {
  const [allDaos, setAllDaos] = useState<DAOType[]>([])
  const [filteredDaos, setFilteredDaos] = useState<DAOType[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(20)

  const { data, isLoading } = useQuery<DAOResponse, Error>({
    queryKey: ['fetchFakeDaos', currentPage, itemsPerPage],
    queryFn: () => fetchFakeDaos(currentPage, itemsPerPage),
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (data) {
      setAllDaos(data.daos)
      setFilteredDaos(data.daos)
      setTotalPages(data.totalPages)
    }
  }, [data])

  useEffect(() => {
    if (data) {
      const checkedDaos = data.daos.filter(item => item.checked)
      const searchedDaos = checkedDaos.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      setFilteredDaos(searchedDaos)
      setTotalPages(Math.ceil(searchedDaos.length / itemsPerPage))
    }
  }, [data, searchTerm])

  const toggleCheckbox = (categoryName: string) => {
    const updatedItems = allDaos.map(item => {
      return item.category_name === categoryName ? { ...item, checked: !item.checked } : item
    })

    setAllDaos(updatedItems)

    const filtered = updatedItems.filter(item => item.checked)
    setFilteredDaos(filtered)
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  return (
    <div className='bg-[#FAFAFA] flex flex-col items-center w-full min-h-screen'>
      <Header />
      <Presentation title='DAOs' description='Explore and interact with the DAOs of Origyn.' />
      <div className='flex flex-col sm:flex-row justify-between w-full px-6 xl:px-[76px] mt-6 space-y-6 sm:space-y-0 sm:space-x-3'>
        <OpenProposalBar totalAvatars={allDaos.filter(dao => dao.checked).length} />
        <CheckboxBar items={allDaos} toggleCheckbox={toggleCheckbox} />
        <SearchBar handleSearch={handleSearch} placeholder='Search for a specific collection' />
      </div>
      <div className='px-6 md:px-[76px] w-full mb-12'>
        <DAOsList
          daos={filteredDaos}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          loading={isLoading}
        />
      </div>
    </div>
  )
}

export default Daos
