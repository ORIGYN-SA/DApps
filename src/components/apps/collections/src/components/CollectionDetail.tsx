import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SearchBar from './Bar/SearchBar';
import Header from './Header/Header';

const CollectionDetail: React.FC = () => {
  const [name, setName] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/\/collection\/([^/]+)/);
    if (match) {
      setName(match[1]);
    }
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="bg-[#FAFAFA] flex flex-col items-center w-full min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between w-full px-[76px] mt-6 space-y-6 sm:space-y-0 sm:space-x-12">
        <SearchBar handleSearch={handleSearch} />
      </div>
      <div className="px-[76px] w-full justify-center items-center flex flex-col self-center mt-40">
        <p className='font-bold'>Collection Name: {name || 'Unknown'}</p>
      </div>
    </div>
  );
};

export default CollectionDetail;
