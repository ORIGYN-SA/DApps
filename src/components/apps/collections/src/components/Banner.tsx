import React from 'react';
import { NFT } from '../types/global';

export const Banner = ({ collectionName }: { collectionName: string }) => {
  return (
    <div className="bg-charcoal flex justify-center items-center w-full h-10 fixed z-50">
      <div>
        <div className="flex flex-row items-center gap-2">
          <span className="text-white text-xs font-bold leading-none">Collection</span>
          <span className="text-white text-xs font-medium"> – {collectionName}</span>
        </div>
      </div>
    </div>
  );
};

export default Banner;
