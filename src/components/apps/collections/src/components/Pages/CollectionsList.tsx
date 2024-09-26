import React, { useEffect, useState } from 'react';
import Header from './../Header/Header';
import Presentation from './../Presentation/Presentation';
import CheckboxBar from './../Bar/CheckBoxBar';
import SearchBar from './../Bar/SearchBar';
import CollectionsList from './../Collections/CollectionsList';
import { useGetCollectionsList } from '../../hooks/useGetCollectionsList';
import { CollectionType } from '../../types/global';

const CollectionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  const { data, isLoading, error } = useGetCollectionsList(0, itemsPerPage);

  const [allCollections, setAllCollections] = useState<CollectionType[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<CollectionType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    if (data) {
      setAllCollections(data.collections);
      setFilteredCollections(data.collections);
      setTotalPages(data.totalPages);
    }
  }, [data]);

  useEffect(() => {
    if (allCollections) {
      const filtered = allCollections
        .filter((item) => item.checked)
        .filter((item) => {
          const name = item.name;
          return name ? name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        });

      setFilteredCollections(filtered);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setCurrentPage(1);
    }
  }, [searchTerm, itemsPerPage, allCollections]);

  const toggleCheckbox = (name: string) => {
    const updatedItems = allCollections.map((item) => {
      const itemName = item.name;
      return itemName === name ? { ...item, checked: !item.checked } : item;
    });

    setAllCollections(updatedItems);

    const filtered = updatedItems.filter((item) => item.checked);

    setFilteredCollections(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (error) {
    return (
      <div className="bg-[#FAFAFA] flex flex-col items-center w-full min-h-screen">
        <Header />
        <Presentation />
        <p>Error while loading collections : {error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] flex flex-col items-center w-full min-h-screen">
      <Header />
      <Presentation />
      <div className="flex flex-col sm:flex-row justify-between w-full px-[76px] mt-6 space-y-6 sm:space-y-0 sm:space-x-12">
        <CheckboxBar collections={allCollections} toggleCheckbox={toggleCheckbox} />
        <SearchBar handleSearch={handleSearch} placeholder='Search for a specific collection' />
      </div>
      <div className="px-[76px] w-full ">
        <CollectionsList
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
  );
};

export default CollectionsPage;
