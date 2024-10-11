import React from 'react';

const Presentation: React.FC = () => {
  return (
    <div className="flex flex-col items-center my-8 md:my-16 md:px-[76px] space-y-4 md:space-y-0">
      <h1 className="text-center text-charcoal font-dm-sans text-[64px] font-extrabold leading-[60px] tracking-[-3.2px]">
        Collections
      </h1>
      <p className="text-center font-dm-sans text-[22px] font-light text-slate">
        Explore and interact with the collections of Origyn NFT.
      </p>
    </div>
  );
};

export default Presentation;
