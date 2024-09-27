// src/components/NFTPage.tsx

import React, { useState, useMemo } from 'react';
import NavBar from '../NavBar/NavBar';
import { NFT } from '../../types/global';
import { Link } from 'react-router-dom';
import Banner from '../Banner';
import { useGetNFTDetails } from '../../hooks/useGetNFTDetails';
import ConnectWallet from '../Buttons/ConnectWallet';

interface HeaderProps {
  nft: NFT | undefined;
  canisterId: string;
}

const Header: React.FC<HeaderProps> = React.memo(({ nft, canisterId }) => {
  return (
    <div className="flex flex-col md:flex-row mt-44 md:mt-20 pb-8 px-8 items-center border-b border-mouse md:ml-[88px]">
      <div className="flex flex-col gap-2">
        <p className="text-[#222526] text-[40px] font-bold leading-normal">Collection</p>
        <Link to={`/collection/${canisterId}`}>
          <div className="text-[#212425] text-[10px] font-medium leading-[16px] tracking-[2px] uppercase flex flex-row items-center group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5 mr-2 group-hover:-translate-x-1 duration-300 ease-in-out transition-all"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Collections / {nft?.collectionName || 'Collection Name'}
          </div>
        </Link>
      </div>
      <div className="md:ml-auto mt-5 md:mt-0">
        <ConnectWallet />
      </div>
    </div>
  );
});

interface ImageContainerProps {
  nft: NFT | undefined;
}

const ImageContainer: React.FC<ImageContainerProps> = React.memo(({ nft }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isImageError, setIsImageError] = useState(false);

  return (
    <div className="xl:w-[562px] xl:h-[564px] relative">
      {isImageLoading && !isImageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-tl-2xl rounded-bl-2xl">
          <div className="xl:w-[562px] xl:h-[564px] bg-gray-300"></div>
        </div>
      )}
      {isImageError ? (
        <div className="flex items-center justify-center h-full bg-red-100 text-red-700 rounded-tl-2xl rounded-bl-2xl">
          <p>Error loading image</p>
        </div>
      ) : (
        <img
          className={`rounded-tl-2xl rounded-bl-2xl object-contain w-full h-full ${
            isImageLoading ? 'hidden' : 'block'
          }`}
          src={nft?.image || 'https://via.placeholder.com/562x564'}
          alt={nft?.name || 'NFT Image'}
          onLoad={() => setIsImageLoading(false)}
          onError={() => {
            setIsImageLoading(false);
            setIsImageError(true);
          }}
        />
      )}
    </div>
  );
});

interface NFTDetailsProps {
  nft: NFT;
}

const NFTDetails: React.FC<NFTDetailsProps> = React.memo(({ nft }) => {
  return (
    <>
      <div className="flex-col justify-start items-start gap-2 flex w-full">
        <div className="gap-0.5 text-[#69737c] text-[10px] font-medium uppercase leading-[18px] tracking-widest">
          {nft.collectionName || 'Collection Name'}
        </div>
        <div className="text-[#262c2e] text-[40px] font-bold">{nft.name || 'NFT Name'}</div>
        <div className="gap-2 flex flex-row items-center flex-wrap text-[#212425]">
          <img src="/assets/owner.svg" alt="owner" className="w-6 h-6" />
          <p className="font-light leading-normal w-fit">Owned by</p>
          <p className="font-bold">{nft?.owner || 'Unknown'}</p>
        </div>
      </div>
      <div className="flex-col flex">
        <div className="px-2 md:px-8 py-6 md:py-4 bg-white rounded-2xl border border-[#e1e1e1] flex-col w-full">
          <div className="text-[#2E2E2E] text-base font-bold">Current price</div>
          <div className="flex flex-row justify-start items-center gap-2">
            <img src="/assets/IC_Icon.svg" alt="ICP" className="w-10 h-10" />
            <div className="text-black text-[22px] md:text-[28px] font-bold">
              {nft.priceICP > 0 ? `${nft.priceICP} ICP` : 'Not for sale'}
            </div>
            {nft.priceUSD > 0 && (
              <div className="text-[#6e6d66] text-base font-light">
                (${nft.priceUSD.toFixed(2)})
              </div>
            )}
          </div>
          {nft.priceICP > 0 && (
            <button className="bg-[#212425] rounded-full justify-center items-center w-full mt-4">
              <p className="text-center text-white text-sm font-semibold leading-[48px]">Buy now</p>
            </button>
          )}
        </div>
        <div className="self-stretch justify-start items-start gap-2 inline-flex mt-6 md:mt-2">
          <div className="w-[18px] h-[18px] relative">
            <div className="w-[18px] h-[18px] left-0 top-0 absolute bg-[#e1e1e1] rounded-full" />
            <div className="w-[18px] left-0 top-[1px] absolute text-center text-[#69737c] text-[13px] font-bold">
              i
            </div>
          </div>
          <div className="grow shrink basis-0 opacity-70 text-[#69737c] text-[13px] font-light leading-none">
            Reminder: This is a peer-to-peer gold purchase, with pricing set by the gold bar's
            owner.
          </div>
        </div>
      </div>
      <div className="px-2 py-1.5 bg-[#f9fafe] rounded-[100px] border border-[#e9eaf1] justify-center items-center gap-1 inline-flex">
        <img src="/assets/layer.svg" alt="layer" className="w-4 h-4" />
        <div className="text-center text-[#69737c] text-[10px] font-normal">
          Check this certificate on-chain
        </div>
      </div>
    </>
  );
});

const Skeleton: React.FC = () => {
  return (
    <div className="flex flex-row bg-white rounded-2xl mx-auto border border-[#e1e1e1] xl:max-w-5xl 4xl:max-w-7xl min-w-[1128px]">
      {/* Image Skeleton */}
      <div className="w-[562px] bg-gray-200 animate-pulse rounded-tl-2xl rounded-bl-2xl"></div>
      <div className="flex flex-col justify-center items-center gap-8 mx-10 w-[562px] h-[564px]">
        {/* Collection Name Skeleton */}
        <div className="w-full h-6 bg-gray-200 animate-pulse rounded-md mb-2"></div>

        {/* NFT Name Skeleton */}
        <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md mb-4"></div>

        {/* Owner Info Skeleton */}
        <div className="flex flex-row gap-2 items-center">
          <div className="w-6 h-6 bg-gray-200 animate-pulse rounded-full"></div>
          <div className="w-32 h-4 bg-gray-200 animate-pulse rounded-md"></div>
        </div>

        {/* Price Skeleton */}
        <div className="w-full flex flex-col mt-4 gap-2">
          <div className="w-24 h-6 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="flex flex-row items-center gap-2">
            <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="w-32 h-8 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="w-full h-12 bg-gray-300 animate-pulse rounded-full mt-4"></div>

        {/* Additional Info Skeleton */}
        <div className="w-full h-4 bg-gray-200 animate-pulse rounded-md mt-4"></div>
      </div>
    </div>
  );
};

const NFTPage: React.FC = () => {
  const urlParts = useMemo(() => window.location.hash.split('/'), []);
  const canisterId = urlParts[urlParts.indexOf('collection') + 1] || '';
  const NFTid = urlParts[urlParts.indexOf('collection') + 2] || '';

  const { data: nft, isLoading, error } = useGetNFTDetails(canisterId, NFTid);

  return (
    <div className="bg-gradient-to-t from-[#ebebeb] to-[#f9f9f9] flex flex-col min-h-screen">
      <Banner collectionName={nft?.collectionName || 'Unknown'} />
      <div className="flex flex-row flex-grow">
        <NavBar />
        <div className="flex flex-col items-center w-full">
          <div className="w-full">
            <Header nft={nft} canisterId={canisterId} />
            <div className="xl:mt-10 3xl:mt-[92px] flex flex-col">
              {error && (
                <div className="flex items-center justify-center px-6 py-4 text-red-700 rounded-2xl">
                  <p>An error occurred while fetching NFT details. : {error.message}</p>
                </div>
              )}
              <div className="flex flex-col w-11/12 mx-auto md:w-10/12 pb-8 md:pb-0 md:ml-28 mt-8 xl:ml-28 2xl:mx-auto xl:flex-row bg-white mb-10 md:mb-20 rounded-2xl border border-[#e1e1e1] xl:max-w-5xl 4xl:max-w-7xl xl:min-w-[1128px] xl:min-h-[564px]">
                {isLoading ? (
                  <Skeleton />
                ) : (
                  nft && (
                    <>
                      <ImageContainer nft={nft} />
                      <div className="flex-col justify-center items-center gap-8 inline-flex px-6 md:mx-10 xl:w-[562px] xl:h-[564px]">
                        <NFTDetails nft={nft} />
                      </div>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTPage;
