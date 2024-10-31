import React from 'react';
import CheckboxBar from '../Bar/CheckBoxBar';
import SearchBar from '../Bar/SearchBar';
import FilterBar from '../Bar/FilterBar';
import { CollectionType } from '../../types/global';

interface NFTsPanelProps {
  handleSearch: (term: string) => void;
  filteredCollections: CollectionType[];
  toggleCheckbox: (name: string) => void;
  setListedFilter: (status: 'all' | 'listed' | 'non-listed') => void;
}

const MyNFTsPanel: React.FC<NFTsPanelProps> = ({
  handleSearch,
  filteredCollections,
  toggleCheckbox,
  setListedFilter,
}) => {
  return (
    <div className="p-6 space-y-2 w-full">
      <SearchBar handleSearch={handleSearch} placeholder="Search for a specific collection" />
      <CheckboxBar collections={filteredCollections} toggleCheckbox={toggleCheckbox} />
      <FilterBar setListedFilter={setListedFilter} />
    </div>
  );
};

export default MyNFTsPanel;
