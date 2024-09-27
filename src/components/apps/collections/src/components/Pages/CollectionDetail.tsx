import React, { useState } from 'react';
import SearchBar from './../Bar/SearchBar';
import Pagination from './../Pagination/Pagination';
import NavBar from './../NavBar/NavBar';
import { useCollectionDetails } from '../../hooks/useCollectionDetails';
import { NFT } from '../../types/global';
import { Link } from 'react-router-dom';
import Banner from './../Banner';
import ConnectWallet from './../Buttons/ConnectWallet';
import OpenASale from './../Buttons/OpenASale';

const NFTCard = ({ nft, canisterId }: { nft: NFT; canisterId: string }) => (
  <Link to={`/collection/${canisterId}/${nft.id}`} className="flex flex-col">
    <div className="bg-white rounded-2xl border border-gray-300 flex flex-col group relative overflow-hidden">
      <div className="aspect-w-1 aspect-h-1 w-full rounded-t-2xl overflow-hidden">
        <img
          className="w-full h-full object-cover hover:scale-110 duration-300 ease-in-out transition-transform"
          src={nft.image}
          alt={nft.name}
        />
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-gray-900 text-base font-bold">{nft.name}</h3>
        </div>
        <div className="mt-2">
          <span className="px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded-full">
            {nft.priceICP > 0 ? `${nft.priceICP} ICP` : 'Not for sale'}
          </span>
        </div>
      </div>
      <div
        className="opacity-0 absolute bottom-0 left-0 right-0 h-10 bg-charcoal rounded-b-2xl flex items-center justify-center
                 group-hover:opacity-100 duration-300 ease-in-out transition-opacity pointer-events-none group-hover:pointer-events-auto"
      >
        <p className="text-sm text-white">Buy now</p>
      </div>
    </div>
  </Link>
);

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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const collectionCanisterId = window.location.hash.split('/').pop() || '';

  const { data: collection, isLoading, error } = useCollectionDetails(collectionCanisterId);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
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
    <div className="flex flex-row w-full">
      <NavBar />
      <div className="bg-gray-100 flex flex-col flex-grow items-center min-h-screen ">
        <Banner collectionName={collection?.name[0] || 'Unknown'} />
        <div className="mt-44 mb-4 md:mt-16 flex flex-row justify-center md:justify-end w-full space-x-6 md:px-[30px] 4xl:px-0 4xl:max-w-7xl">
          <OpenASale />
          <ConnectWallet />
        </div>
        <div className="bg-white rounded-[20px] border border-[#e1e1e1] mt-20 md:w-11/12 md:ml-[88px] relative 4xl:max-w-7xl">
          {/* Header of the collection */}
          <div className="flex flex-col items-center mb-10 w-full">
            <img
              className="w-40 h-40 rounded-full bg-mouse object-cover shadow-lg border-4 border-white absolute -top-[82px]"
              src={collection?.logo[0] || 'https://via.placeholder.com/164x164'}
              alt={collection?.name[0] || 'Unknown'}
            />
            <div className="text-center mt-28 w-full">
              <p className="text-[#69737c] text-[10px] font-medium uppercase leading-[18px] tracking-widest">
                {collectionCanisterId || ''}
              </p>
              <h1 className="text-center text-[#212425] text-[28px] font-bold ">
                {collection?.name[0] || ''}
              </h1>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 mt-6 space-y-6 sm:space-y-0 sm:space-x-12 w-full">
            <div className="flex-grow w-full flex items-center">
              <SearchBar handleSearch={handleSearch} placeholder="Search for a specific NFT" />
            </div>
            <p className="text-[13px] font-semibold leading-[16px] not-italic whitespace-nowrap flex items-center h-full">
              {isLoading
                ? 'Loading collection... '
                : `${currentNFTs.length * totalPages} ${currentNFTs.length * totalPages > 1 ? 'results' : 'result'}`}
            </p>
          </div>

          <div className="px-6 md:px-20 w-full flex flex-col items-center my-10">
            {/* NFTs list */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
              {isLoading ? (
                Array.from({ length: itemsPerPage }, (_, index) => <NFTSkeleton key={index} />)
              ) : error ? (
                <p>Error while loading NFTs : {error.message}</p>
              ) : (
                currentNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} canisterId={collectionCanisterId} />
                ))
              )}
            </div>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-6 w-full">
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
