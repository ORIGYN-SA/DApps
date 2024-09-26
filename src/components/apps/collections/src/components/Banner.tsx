import React from 'react';

export const Banner = ({ collectionName }: { collectionName: string }) => {
  return (
    <div className="bg-charcoal flex justify-center items-center w-full h-10 fixed z-50 left-0 right-0">
      <div className="w-full max-w-screen">
        <div className="flex flex-row items-center justify-center gap-2">
          <span className="text-white text-xs font-bold leading-none">Collection</span>
          <span className="text-white text-xs font-medium"> – {collectionName}</span>
        </div>
      </div>
    </div>
  );
};

export default Banner;
