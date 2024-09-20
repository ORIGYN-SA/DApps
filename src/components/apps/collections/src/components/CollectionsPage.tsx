import React, { useState, useEffect } from 'react';
import '../index.css';
import Header from './Header/Header';
import Presentation from './Presentation/Presentation';
import CheckboxBar from './Bar/CheckBoxBar';
import SearchBar from './Bar/SearchBar';
import { fetchCollectionsList } from '../../src/data/index';
import CollectionsList from './Collections/CollectionsList';
import { Principal } from '@dfinity/principal';

export interface Collection {
  name: [] | [string];
  canister_id: string;
  is_promoted: boolean;
  category: [] | [BigUint64Array | bigint[]];
}

export interface CollectionType extends Collection {
  checked: boolean;
  image?: string;
  category_id?: string;
  nftCount?: bigint;
}

const CollectionsPage: React.FC = () => {
  const [allCollections, setAllCollections] = useState<CollectionType[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<CollectionType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCollections = async () => {
    const response = await fetchCollectionsList(0, itemsPerPage);
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
      .filter((item) => {
        const name = item.name[0];
        return name ? name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
      });

    setFilteredCollections(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const toggleCheckbox = (name: string) => {
    const updatedItems = allCollections.map((item) => {
      const itemName = item.name[0];
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

  return (
    <div className="bg-[#FAFAFA] flex flex-col items-center w-full min-h-screen">
      <Header />
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
