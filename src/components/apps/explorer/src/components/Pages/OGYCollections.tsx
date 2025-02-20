import React, { useEffect, useState } from 'react'
import Presentation from '../Presentation/Presentation'
import { useGetCollectionsList } from '@dapp/common-hooks'
import { CollectionType } from '@dapp/common-types'
import { Header, SearchBar } from '@dapp/features-components'
import { CheckboxBar } from '@dapp/features-components'
import OGYCollectionsList from '../Collections/OGYCollectionsList'

const OGYCollectionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(40)
  const { data, isLoading, error } = useGetCollectionsList(0, itemsPerPage)
  const [allCollections, setAllCollections] = useState<CollectionType[]>([])
  const [filteredCollections, setFilteredCollections] = useState<CollectionType[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    if (data) {
      setAllCollections(data.collections)
      setFilteredCollections(data.collections)
      setTotalPages(data.totalPages)
    }
  }, [data])

  useEffect(() => {
    if (allCollections) {
      const filtered = allCollections
        .filter(item => item.checked)
        .filter(item => {
          const name = item.name
          return name ? name.toLowerCase().includes(searchTerm.toLowerCase()) : false
        })

      setFilteredCollections(filtered)
      setTotalPages(Math.ceil(filtered.length / itemsPerPage))
      setCurrentPage(1)
    }
  }, [searchTerm, itemsPerPage, allCollections])

  const toggleCheckbox = (categoryName: string) => {
    const updatedItems = allCollections.map(item => {
      return item.category_name === categoryName ? { ...item, checked: !item.checked } : item
    })

    setAllCollections(updatedItems)

    const filtered = updatedItems.filter(item => item.checked)

    setFilteredCollections(filtered)
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  if (error) {
    return (
      <div className='bg-[#FAFAFA] flex flex-col items-center w-full min-h-screen'>
        <Header />
        <Presentation
          title={'Collections'}
          description={'Explore and interact with the collections of Origyn NFT.'}
        />
        <p>Error while loading collections : {error.message}</p>
      </div>
    )
  }

  return (
    <div className='bg-[#FAFAFA] flex flex-col items-center md:w-full min-h-screen'>
      <Header />
      <div className='3xl:max-w-[90rem] w-full'>
        <Presentation
          title={'Collections'}
          description={'Explore and interact with the collections of Origyn NFT.'}
        />
        <div className='flex flex-col sm:flex-row justify-between w-full px-6 xl:px-[76px] mt-6 space-y-6 sm:space-y-0 sm:space-x-3'>
          <CheckboxBar items={allCollections} toggleCheckbox={toggleCheckbox} />
          <SearchBar handleSearch={handleSearch} placeholder='Search for a specific collection' />
        </div>
        <div className='px-6 xl:px-[76px] w-full '>
          <OGYCollectionsList
            collections={filteredCollections}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default OGYCollectionsPage
