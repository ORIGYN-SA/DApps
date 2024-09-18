import React, { useState, useEffect } from 'react';
import '../index.css';
import Header from '../components/Header/Header';
import Presentation from '../components/Presentation/Presentation';
import CheckboxBar from '../components/Bar/CheckBoxBar';
import SearchBar from '../components/Bar/SearchBar';
import Collections from '../components/Collections/Collections';
import { fetchCollectionsFromBackend, Collection } from '../data/index';
const Daos: React.FC = () => {
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);


  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="bg-[#FAFAFA] flex flex-col items-center w-full min-h-screen p-6">
      <Header />
      <Presentation />
      <div className="flex flex-col sm:flex-row justify-between w-full px-[76px] mt-6 space-y-6 sm:space-y-0 sm:space-x-12">
        <SearchBar handleSearch={handleSearch} />
      </div>
      <div className="px-[76px] w-full ">
      </div>
    </div>
  );
};

export default Daos;
