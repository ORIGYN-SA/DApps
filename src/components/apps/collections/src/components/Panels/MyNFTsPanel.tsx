// src/components/Panels/NFTsPanel.tsx
import React from 'react'
import { useGetCollectionsList } from '../../hooks/useGetCollectionsList'
import CollectionsList from '../Collections/OGYCollectionsList'
import { CollectionType } from '../../types/global'
import CheckboxBar from '../Bar/CheckBoxBar'
import SearchBar from '../Bar/SearchBar'
import { useUserProfile } from '../../context/UserProfileContext'

interface NFTsPanelProps {
  searchTerm: string
  handleSearch: (term: string) => void
  filteredCollections: CollectionType[]
  toggleCheckbox: (name: string) => void
}

const MyNFTsPanel: React.FC<NFTsPanelProps> = ({
  searchTerm,
  handleSearch,
  filteredCollections,
  toggleCheckbox,
}) => {
  return (
    <div className='p-6'>
      <SearchBar handleSearch={handleSearch} placeholder='Search for a specific collection' />
      <CheckboxBar collections={filteredCollections} toggleCheckbox={toggleCheckbox} />
      {/* Vous pouvez décommenter ceci lorsque CollectionsList est prêt */}
      {/* <CollectionsList
        collections={filteredCollections}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        loading={isLoading}
      /> */}
    </div>
  )
}

export default MyNFTsPanel
