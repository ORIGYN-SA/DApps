import React from 'react';

const SearchSpecificCollectionBar: React.FC = () => {
  return (
    <div className="relative w-1/2">
      <div
        className={`bg-white text-slate-700 font-semibold border rounded-full
        border-mouse p-3 w-full cursor-pointer flex justify-between items-center`}
      >
        Search for a specific collection
        <span className={`transform font-semibold text-lg transition-transform`}>{'>'}</span>
      </div>
    </div>
  );
};

export default SearchSpecificCollectionBar;
