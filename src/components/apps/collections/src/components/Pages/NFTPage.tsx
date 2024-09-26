import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar';
import { NFT } from '../../types/global';
import { Link } from 'react-router-dom';
import Banner from '../Banner';
import { useGetNFTDetails } from '../../hooks/useGetNFTDetails';

interface NFTPageProps {
  NFTid: string;
}

const Header = ({ nft, canisterId }: { nft: NFT | undefined; canisterId: string }) => {
  return (
    <div className="flex flex-row mt-20 pb-8 px-8 items-center border-b border-mouse ml-[88px] 4xl:ml-0">
      <div className="flex flex-col gap-2 ">
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
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Collections / the midnightsummer night dream
          </div>
        </Link>
      </div>
      <button className="bg-black ml-auto px-5 py-4 h-fit rounded-full hover:scale-105 duration-300 ease-in-out transition-all text-center text-white text-sm font-semibold">
        Connect wallet
      </button>
    </div>
  );
};

const NFTPage: React.FC<NFTPageProps> = () => {
  const [nft, setNft] = useState<NFT | undefined>();
  const [loading, setLoading] = useState(true);

  const urlParts = window.location.hash.split('/');
  const canisterId = urlParts[urlParts.indexOf('collection') + 1] || '';
  const NFTid = urlParts[urlParts.indexOf('collection') + 2] || '';

  useEffect(() => {
    const fetchData = async () => {
      if (NFTid) {
        setLoading(true);
        const data = await useGetNFTDetails(canisterId, NFTid);
        // const data = {
        //   nft: {
        //     id: NFTid,
        //     name: 'NFT Name',
        //     collectionName: 'Collection Name',
        //     image: 'https://via.placeholder.com/243x244',
        //     price: '12 OGY',
        //   },
        // };
        // setNft(data.nft);
        console.log(data);
        setLoading(false);
      }
    };
    fetchData();
  }, [NFTid]);

  return (
    <div className="bg-gradient-to-t from-[#ebebeb] to-[#f9f9f9] flex flex-col min-h-screen">
      <Banner collectionName={nft?.collectionName || 'Unknown'} />
      <div className="flex flex-row flex-grow">
        <NavBar />
        <div className="flex flex-col items-center w-full 4xl:max-w-7xl mx-auto">
          <div className="w-full ">
            <Header nft={nft} canisterId={canisterId} />
            <div className="xl:mt-10 3xl:mt-[92px] flex flex-col">
              <div className="flex flex-row bg-white mb-20 rounded-2xl mx-auto border border-[#e1e1e1] 4xl:max-w-7xl">
                <div className="w-[562px] h-[528px]">
                  <img
                    className="rounded-tl-2xl rounded-bl-2xl"
                    src="https://via.placeholder.com/562x562"
                    alt={nft?.name}
                  />
                </div>
                <div className="w-1/2 flex-col justify-center items-center gap-8 inline-flex  mx-10">
                  <div className="flex-col justify-start items-start gap-2 flex">
                    <div className="gap-0.5 text-[#69737c] text-[10px] font-medium uppercase leading-[18px] tracking-widest">
                      Suzanne Syz Art Jewels
                    </div>
                    <div className=" text-[#262c2e] text-[40px] font-bold">
                      The midsummer Night dream
                    </div>
                    <div className=" gap-2 inline-flex text-[#212425]">
                      <span className="font-light leading-normal">Owned by</span>
                      <span className="font-bold">Username</span>
                    </div>
                  </div>
                  <div className=" flex-col flex">
                    <div className=" px-8 py-4 bg-white rounded-2xl border border-[#e1e1e1] flex-col w-full">
                      <div className=" text-[#2e2e2e] text-base font-bold">Current price</div>
                      <div className="flex flex-row justify-start items-center gap-2">
                        <div className=" text-black text-[28px] font-bold">556.76 ICP</div>
                        <div className=" text-[#6e6d66] text-base font-light">($6751.82)</div>
                      </div>
                      <button className=" bg-[#212425] rounded-full justify-center items-center w-full mt-4">
                        <p className="text-center text-white text-sm font-semibold leading-[48px]">
                          Buy now
                        </p>
                      </button>
                    </div>
                    <div className="self-stretch justify-start items-start gap-2 inline-flex mt-1">
                      <div className="w-[18px] h-[18px] relative">
                        <div className="w-[18px] h-[18px] left-0 top-0 absolute bg-[#e1e1e1] rounded-full" />
                        <div className="w-[18px] left-0 top-[1px] absolute text-center text-[#69737c] text-[13px] font-bold">
                          i
                        </div>
                      </div>
                      <div className="grow shrink basis-0 opacity-70 text-[#69737c] text-[13px] font-light leading-none">
                        Reminder: This is a peer-to-peer gold purchase, with pricing set by the gold
                        bar's owner.
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-1.5 bg-[#f9fafe] rounded-[100px] border border-[#e9eaf1] justify-center items-center gap-1 inline-flex">
                    <div className="text-center text-[#69737c] text-[10px] font-normal">
                      Check this certificate on-chain
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTPage;
