import React from 'react';

interface SkeletonItemProps {
  isFirstItem?: boolean;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({ isFirstItem }) => {
  return isFirstItem ? (
    <div className="w-full p-4 bg-[#f0f0f0] rounded-2xl border border-[#e1e1e1] flex flex-col gap-4 animate-pulse">
      <div className="w-32 h-32 bg-[#d1d1d1] rounded-2xl" />
      <div className="flex flex-col gap-2 w-full">
        <div className="h-7 bg-[#d1d1d1] rounded w-full"></div>
        <div className="h-5 bg-[#e1e1e1] rounded mt-2 w-full"></div>
      </div>
    </div>
  ) : (
    <div className="flex p-2 items-center gap-4 border border-[#E1E1E1] rounded-2xl bg-[#f0f0f0] animate-pulse">
      <div className="h-28 w-28 bg-[#d1d1d1] rounded-2xl" />
      <div className="flex-1 p-4">
        <div className="h-4 bg-[#d1d1d1] rounded w-1/2 mb-2"></div>
        <div className="h-6 bg-[#e1e1e1] rounded w-3/4"></div>
        <div className="h-4 bg-[#d1d1d1] rounded-full w-1/4 mt-4"></div>
      </div>
    </div>
  );
};

export default SkeletonItem;
