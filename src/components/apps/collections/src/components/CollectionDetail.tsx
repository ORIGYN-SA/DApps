import React, { useEffect, useState } from 'react';
import SearchBar from './Bar/SearchBar';
import Pagination from './Pagination/Pagination';
import { CollectionWithNFTs, fetchCollectionDetail, NFT } from '../data/index';
import NavBar from './NavBar/NavBar';

const NFTCard = ({ nft }: { nft: NFT }) => (
  <div className="bg-white rounded-2xl border border-gray-300 flex flex-col">
    <div className="h-56 rounded-t-2xl overflow-hidden">
      <img className="w-full h-full object-cover" src={nft.image} alt={nft.name} />
    </div>
    <div className="p-4 flex flex-col justify-between flex-grow">
      <div>
        {/* <p className="text-gray-500 text-xs uppercase tracking-wide">{nft.collectionName}</p> */}
        <h3 className="text-gray-900 text-base font-bold">{nft.name}</h3>
      </div>
      <div className="mt-2">
        <span className="px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded-full">
          {nft.price}
        </span>
      </div>
    </div>
  </div>
);

// Composant Skeleton
const NFTSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-300 flex flex-col animate-pulse">
    <div className="h-56 rounded-t-2xl overflow-hidden bg-gray-300"></div>
    <div className="p-4 flex flex-col justify-between flex-grow">
      <div>
        {/* <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div> */}
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
      </div>
      <div className="mt-2">
        <span className="px-2 py-1 bg-gray-300 text-white text-xs font-bold rounded-full">
          &nbsp;
        </span>
      </div>
    </div>
  </div>
);

const CollectionDetail: React.FC = () => {
  const [collectionCanisterId, setCollectionCanisterId] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [collection, setCollection] = useState<CollectionWithNFTs | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // État de chargement
  const itemsPerPage = 20;

  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/\/collection\/([^\/]+)/);
    if (match) {
      setCollectionCanisterId(match[1]);
    }

    const fetchData = async () => {
      if (collectionCanisterId) {
        setLoading(true); // Activer le chargement
        const data = await fetchCollectionDetail(collectionCanisterId);
        setCollection(data.collectionWithNFTs);
        setLoading(false); // Désactiver le chargement
      }
    };
    fetchData();
  }, [collectionCanisterId]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredNfts =
    collection?.nfts.filter((nft) => nft.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    [];

  const indexOfLastNFT = currentPage * itemsPerPage;
  const indexOfFirstNFT = indexOfLastNFT - itemsPerPage;
  const currentNFTs = filteredNfts.slice(indexOfFirstNFT, indexOfLastNFT);

  const totalPages = Math.ceil(filteredNfts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-row">
      <NavBar />
      <div className="bg-gray-100 flex flex-col items-center w-full min-h-screen px-[30px] ml-20">
        <div className=" bg-white rounded-[20px] border border-[#e1e1e1] mt-40 w-full relative">
          {/* Header de la collection */}
          <div className="flex flex-col items-center mb-10">
            <img
              className="w-40 h-40 rounded-full shadow-lg border-4 border-white absolute -top-[82px]"
              src={collection?.logo[0] || 'https://via.placeholder.com/164x164'}
              alt={collectionCanisterId}
            />
            <div className="text-center mt-28">
              <p className="text-[#222526] text-center font-dm-sans text-[28px] font-bold">
                {loading ? 'Loading collection...' : collection?.name[0] || 'Unknown collection'}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between w-full px-20 mt-6 space-y-6 sm:space-y-0 sm:space-x-12">
            <SearchBar handleSearch={handleSearch} />
          </div>

          <div className="px-20 w-full flex flex-col items-center mt-10">
            {/* Liste des NFT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
              {loading
                ? Array.from({ length: itemsPerPage }, (_, index) => <NFTSkeleton key={index} />)
                : currentNFTs.map((nft) => <NFTCard key={nft.id} nft={nft} />)}
            </div>

            {/* Pagination */}
            {!loading && (
              <div className="mt-6">
                <Pagination
                  itemsPerPage={itemsPerPage}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  paginate={paginate}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;
