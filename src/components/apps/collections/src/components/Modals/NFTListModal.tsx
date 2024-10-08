import React, { useEffect } from 'react';
import { NFT } from '../../types/global';
import Pagination from '../Pagination/Pagination';

interface NFTListModalProps {
  currentNFTs: NFT[];
  selectedNFT: NFT | null;
  handleSelectNFT: (nft: NFT) => void;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
  paginate: (pageNumber: number) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const NFTListModal: React.FC<NFTListModalProps> = ({
  currentNFTs,
  selectedNFT,
  handleSelectNFT,
  itemsPerPage,
  totalPages,
  currentPage,
  setItemsPerPage,
  paginate,
  onClose,
  onConfirm,
}) => {
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Adjust items per page based on window width
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 640) { // Mobile screen size
        setItemsPerPage(4);
      } else {
        setItemsPerPage(8); // For larger screens
      }
    };

    updateItemsPerPage(); // Call it initially
    window.addEventListener('resize', updateItemsPerPage); // Update on resize

    return () => window.removeEventListener('resize', updateItemsPerPage); // Cleanup on unmount
  }, [setItemsPerPage]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#212425] bg-opacity-70 z-50"
      onClick={handleOutsideClick}
    >
      <div
        className={`bg-white rounded-2xl  py-8 w-[90%] md:w-3/4 3xl:max-w-3xl shadow-lg relative space-y-6`}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 text-2xl hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center justify-center w-full h-full ">
          <h2 className="text-center text-[#212425] text-[22px] font-semibold">Select your NFT</h2>
          <p className="text-center text-[#69737c] text-[13px] font-medium mb-4 px-6">
            Please select one NFT from the list below to open a sale.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-2 gap-4 w-full px-6 md:px-5">
            {currentNFTs.map((nft) => (
              <div
                key={nft.id}
                className={`block ${
                  selectedNFT?.id === nft.id ? 'border-[#33B9FF] border-2' : 'border-gray-300'
                } cursor-pointer border rounded-2xl bg-white transition duration-300`}
                onClick={() => handleSelectNFT(nft)}
              >
                <div className="flex p-2 items-center gap-4">
                  <img
                    src={nft.image || 'https://via.placeholder.com/243x244'}
                    alt={nft.name || 'NFT Image'}
                    className="h-28 w-28 rounded-2xl object-contain"
                  />
                  <div className="w-1/2">
                    <h3 className="text-[#69737C] font-medium text-[10px] leading-[18px] tracking-[2px] uppercase">
                      {nft.collectionName || 'Unknown'}
                    </h3>
                    <p className="text-[16px] font-bold leading-normal">
                      {nft.name || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center md:justify-end items-center mt-4 w-full">
            {totalPages > 1 && (
              <Pagination
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                currentPage={currentPage}
                paginate={paginate}
              />
            )}
          </div>

          <div className="h-[1px] w-full bg-gray-300 my-4"></div>

          <button
            className={`bg-charcoal w-3/4 md:px-0 md:w-1/2 py-4 mt-2 md:mt-6 h-fit rounded-full hover:scale-105 duration-300 ease-in-out transition-all text-center text-white text-sm font-semibold ${
              !selectedNFT ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            disabled={!selectedNFT}
            onClick={onConfirm}
          >
            {selectedNFT ? 'Set the price of your NFT' : 'Choose your NFT'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTListModal;
