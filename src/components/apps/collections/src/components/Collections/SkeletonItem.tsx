import React from 'react';

interface SkeletonItemProps {
  isFirstItem?: boolean;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({ isFirstItem }) => {
  return isFirstItem ? (
    <div className="w-full h-auto p-4 bg-[#f0f0f0] rounded-2xl border border-[#e1e1e1] flex flex-col justify-center items-start gap-4 row-span-2 animate-pulse">
      <div className="w-32 h-32 bg-[#d1d1d1] rounded-2xl" />
      <div className="self-stretch h-[104px] flex-col justify-center items-start gap-2 flex">
        <div className="self-stretch h-[28px] bg-[#d1d1d1] rounded"></div>
        <div className="self-stretch h-[20px] bg-[#e1e1e1] rounded mt-2"></div>
      </div>
    </div>
  ) : (
    <div className="flex p-2 items-center gap-4 flex-row border border-[#E1E1E1] rounded-2xl bg-[#f0f0f0] animate-pulse">
      <div className="h-28 w-28 bg-[#d1d1d1] rounded-2xl" />
      <div className="p-4 flex-1">
        <div className="h-4 bg-[#d1d1d1] rounded w-1/2 mb-2"></div>
        <div className="h-6 bg-[#e1e1e1] rounded w-3/4"></div>
        <div className="h-4 bg-[#d1d1d1] rounded-full w-1/4 mt-4"></div>
      </div>
    </div>
  );
};

export default SkeletonItem;
