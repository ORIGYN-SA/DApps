import React, { useState, useEffect } from 'react';
import '../index.css';
import Header from './Header/Header';
import Presentation from './Presentation/Presentation';
import CheckboxBar from './Bar/CheckBoxBar';
import SearchBar from './Bar/SearchBar';
import { fetchCollectionsFromBackend, Collection } from '../data/index';
import CollectionsList from './Collections/CollectionsList';
const CollectionsPage: React.FC = () => {
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCollections = async () => {
    const response = await fetchCollectionsFromBackend(1, itemsPerPage);
    setAllCollections(response.collections);
    setFilteredCollections(response.collections);
    setTotalPages(response.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    const filtered = allCollections
      .filter((item) => item.checked)
      .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    setFilteredCollections(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchTerm, allCollections, itemsPerPage]);

  const toggleCheckbox = (name: string) => {
    const updatedItems = allCollections.map((item) =>
      item.name === name ? { ...item, checked: !item.checked } : item,
    );
    setAllCollections(updatedItems);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="bg-[#FAFAFA] flex flex-col items-center w-full min-h-screen">
      <Presentation />
      <div className="flex flex-col sm:flex-row justify-between w-full px-[76px] mt-6 space-y-6 sm:space-y-0 sm:space-x-12">
        <CheckboxBar collections={allCollections} toggleCheckbox={toggleCheckbox} />
        <SearchBar handleSearch={handleSearch} />
      </div>
      <div className="px-[76px] w-full ">
        <CollectionsList
          collections={filteredCollections}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CollectionsPage;
