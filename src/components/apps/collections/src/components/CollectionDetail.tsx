import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SearchBar from './Bar/SearchBar';
import Pagination from './Pagination/Pagination';
import { fetchCollectionDetail, NFT } from '../data/index';
import { fetchFakeNFTs } from '../data';

const NFTCard = ({ nft }: { nft: NFT }) => (
  <div className="bg-white rounded-2xl border border-gray-300 flex flex-col">
    <div className="h-56 rounded-t-2xl overflow-hidden">
      <img className="w-full h-full object-cover" src={nft.image} alt={nft.name} />
    </div>
    <div className="p-4 flex flex-col justify-between flex-grow">
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-wide">{nft.collectionName}</p>
        <h3 className="text-gray-900 text-base font-bold">{nft.name}</h3>
        <p className="text-gray-500 text-sm">{nft.subtitle}</p>
      </div>
      <div className="mt-2">
        <span className="px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded-full">
          {nft.price}
        </span>
      </div>
    </div>
  </div>
);

const CollectionDetail: React.FC = () => {
  const { collectionName } = useParams<{ collectionName: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    // Récupère les détails de la collection basée sur le nom de la collection dans l'URL
    const fetchData = async () => {
      const data = await fetchFakeNFTs(1, 20);
      setNfts(data.nfts);
    };
    fetchData();
  }, [collectionName]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Filtrer les NFT en fonction du terme de recherche
  const filteredNfts = nfts.filter((nft) =>
    nft.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const indexOfLastNFT = currentPage * itemsPerPage;
  const indexOfFirstNFT = indexOfLastNFT - itemsPerPage;
  const currentNFTs = filteredNfts.slice(indexOfFirstNFT, indexOfLastNFT);

  const totalPages = Math.ceil(filteredNfts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gray-100 flex flex-col items-center w-full min-h-screen px-[30px]">
      <div className=" bg-white rounded-[20px] border border-[#e1e1e1] mt-40 w-full relative">
        {/* Header de la collection */}
        <div className="flex flex-col items-center mb-10">
          <img
            className="w-40 h-40 rounded-full shadow-lg border-4 border-white absolute -top-[82px]"
            src="https://via.placeholder.com/164x164"
            alt={collectionName}
          />
          <div className="text-center mt-28">
            <p className="text-[#69737c] text-[10px] font-medium  uppercase leading-[18px] tracking-widest">
              {collectionName || 'Unknown'}
            </p>
            <h1 className="text-center text-[#212425] text-[28px] font-bold ">
              {collectionName || 'Unknown'}
            </h1>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between w-full px-20 mt-6 space-y-6 sm:space-y-0 sm:space-x-12">
          <SearchBar handleSearch={handleSearch} />
        </div>

        <div className="px-20 w-full flex flex-col items-center mt-10">
          {/* Liste des NFT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
            {currentNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              currentPage={currentPage}
              paginate={paginate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;
