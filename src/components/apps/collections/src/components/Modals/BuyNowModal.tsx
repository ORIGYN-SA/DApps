import { useState } from 'react';
import Reminder from '../Utils/Reminder';
import { useTokenData } from '../../context/TokenDataContext';
import { NFT } from '../../types/global';

const BuyNowModal: React.FC<{ nft: NFT; onClose: () => void }> = ({ nft, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { getLogo } = useTokenData();

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const onBuyNowClick = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#212425] bg-opacity-70 z-50" onClick={handleOutsideClick}>
      <div className="bg-white rounded-2xl py-8 w-[90%] md:w-1/2 xl:w-1/3 2xl:w-1/4 shadow-lg relative space-y-6 min-h-[400px]">
        <button className="absolute top-4 right-4 text-gray-400 text-2xl hover:text-gray-600" onClick={onClose}>
          &times;
        </button>
        {isProcessing ? (
          <div className="my-12 flex flex-col items-center justify-center w-full h-full">
            <img src="/assets/spinner.png" alt="Loading spinner" className="w-12 h-12 animate-spin my-8" />
            <h2 className="text-[22px] font-semibold leading-normal">Processing</h2>
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <img src="/assets/tick-circle.svg" alt="Success" className="w-20 h-20 my-6" />
            <h2 className="text-[22px] font-semibold leading-normal">NFT successfully purchased</h2>
            <p className="text-sm mb-4 text-slate text-[13px] font-medium leading-normal text-center">Your NFT has been successfully purchased.</p>
            <div className="w-full px-3 md:px-6">
              <div className="flex px-3 py-2 items-center gap-4 border border-gray-300 rounded-t-2xl justify-center">
                <img src={nft.image || 'https://via.placeholder.com/243x244'} alt={nft.name || 'NFT Image'} className="h-28 w-28 rounded-2xl object-contain" />
                <div className="p-4">
                  <h3 className="text-[#69737C] font-medium text-[10px] leading-[18px] tracking-[2px] uppercase">{nft.collectionName || 'Unknown'}</h3>
                  <p className="text-[16px] font-bold leading-normal">{nft.name || 'Unknown'}</p>
                </div>
              </div>
              <div className="h-[37px] px-6 w-full py-2 bg-[#f9fafe] rounded-bl-[20px] rounded-br-[20px] border-l border-r border-b border-[#e1e1e1] justify-start items-center gap-4 inline-flex">
                <div className="w-[88px] text-[#69737c] text-[13px] font-medium">Price</div>
                <div className="justify-start items-center gap-2 flex w-full">
                  <img src={getLogo(nft.currency)} alt="Token Logo" className="w-6 h-6" />
                  <div className="text-black text-base font-bold">
                    {nft.price.toFixed(2)} {nft.currency}
                  </div>
                  <div className="text-[#6e6d66] text-[13px] font-light">(${nft.priceUSD.toFixed(2)})</div>
                </div>
              </div>
            </div>
            <div className="h-[1px] w-full bg-gray-300 my-4"></div>
            <a className="bg-black mt-4 px-5 py-4 w-1/2 rounded-full hover:scale-105 duration-300 ease-in-out transition-all text-center text-white text-sm font-semibold" href="" target="_blank" rel="noreferrer" onClick={onClose}>See certificate</a>
            <p className="text-center text-[#69737c] text-[13px] font-normal leading-none mt-2">Balance: xx ICP</p>
          </div>
        ) : (
          <>
            <h2 className="text-center text-[#212425] text-[22px] font-semibold">Confirmation</h2>
            <div className="w-full px-3 md:px-6">
              <div className="border border-[#e1e1e1] bg-[#f9fafe] rounded-[25px] p-4 flex items-center gap-4">
                <img src={nft.image} alt={nft.name} className="w-24 h-24 object-contain rounded-lg" />
                <div className="text-center">
                  <h3 className="text-base font-bold">{nft.name}</h3>
                  <p className="text-[#69737c] text-[10px] font-medium uppercase leading-[18px] tracking-widest">{nft.collectionName}</p>
                </div>
                <p className="text-center text-[#262c2e] text-base font-bold leading-snug">
                  {nft.price.toFixed(2)} {nft.currency} <span className="text-[#6e6d66] text-base font-normal leading-[25px]">(${nft.priceUSD.toFixed(2)})</span>
                </p>
              </div>
              <div className="mt-3">
                <Reminder />
                <div className="mt-6">
                  <button className="bg-[#212425] rounded-full w-full py-3" onClick={onBuyNowClick}>
                    <span className="text-center text-white text-sm font-semibold">Buy for {nft.price.toFixed(2)} {nft.currency}</span>
                  </button>
                </div>
              </div>
            </div>
            <p className="text-center text-[#69737c] text-[13px] font-normal leading-none mt-2">Balance: xx ICP</p>
          </>
        )}
      </div>
    </div>
  );
};

export default BuyNowModal;
