import React from 'react';
import { Collection } from '../../data';
import Pagination from '../Pagination/Pagination';

interface CollectionsProps {
  collections: Collection[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
}

const Collections: React.FC<CollectionsProps> = ({
  collections,
  currentPage,
  itemsPerPage,
  totalPages,
  setCurrentPage,
  setItemsPerPage,
}) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = collections.slice(indexOfFirstItem, indexOfLastItem);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className=" bg-white rounded-2xl mt-8  w-full p-8 border border-[#e1e1e1] shadow-md">
      <h3 className="font-semibold text-2xl leading-normal">All Collections</h3>
      <p className="text-slate text-[13px] font-medium leading-normal">
        {collections.length} collections
      </p>
      {/* Display paginated collections */}
      <div className="w-full mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentItems.map((collection, index) =>
          index === 0 ? (
            // Special design for the first item (spans two rows)
            <div
              key={collection.name}
              className="w-full h-auto hover:bg-[#b7bbd51d] p-4 bg-white rounded-2xl border border-[#e1e1e1] flex flex-col justify-center items-start gap-4 row-span-2"
            >
              <img className="w-32 h-32 rounded-2xl" src={collection.image} alt={collection.name} />
              <div className="self-stretch h-[104px] flex-col justify-center items-start gap-2 flex">
                <div className="self-stretch h-[72px] flex-col justify-center items-start flex">
                  <div className="self-stretch text-[#212425] text-[28px] font-bold font-['DM Sans']">
                    {collection.name}
                  </div>
                </div>
                <div className="self-stretch justify-start items-center gap-4 inline-flex">
                  <div className="px-2 py-1 bg-[#212425] rounded-[100px] justify-center items-center gap-2.5 flex">
                    <div className="text-white text-xs font-bold font-['DM Sans']">
                      {collection.nftCount > 1
                        ? `${collection.nftCount} NFTs`
                        : `${collection.nftCount} NFT`}
                    </div>
                  </div>
                  <div className="justify-start items-center gap-0.5 flex">
                    <div className="text-[#69737c] text-[10px] font-medium font-['DM Sans'] uppercase leading-[18px] tracking-widest">
                      {collection.creator}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Normal design for other items
            <div
              key={collection.name}
              className="flex p-2 items-center gap-4 hover:bg-[#b7bbd51d] flex-row border border-[#E1E1E1] rounded-2xl bg-white"
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="h-28 w-28 rounded-2xl object-cover"
              />
              <div className="p-4">
                <h3 className="text-[#69737C] font-medium text-[10px] leading-[18px] tracking-[2px] uppercase">
                  {collection.creator}
                </h3>
                <p className="text-[16px] font-bold leading-normal">{collection.name}</p>
                <div className="h-6 px-2 py-1 bg-[#212425] rounded-[100px] justify-center items-center gap-2.5 inline-flex">
                  <div className="text-white text-xs font-semibold">
                    {collection.nftCount > 1
                      ? `${collection.nftCount} NFTs`
                      : `${collection.nftCount} NFT`}
                  </div>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
      <div className="flex flex-row w-full items-center mt-6">
        {/* Selector for items per page */}
        <div className="flex justify-end items-center">
          <label className="mr-2 text-slate text-sm font-light">Items per page</label>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-[#F1F6F9] flex p-[5px_10px] font-semibold text-slate items-center gap-[5px] rounded-full"
          >
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={60}>60</option>
          </select>
        </div>
        {/* Pagination */}
        <div className="ml-auto">
          {totalPages > 1 && (
            <Pagination
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              currentPage={currentPage}
              paginate={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Collections;
