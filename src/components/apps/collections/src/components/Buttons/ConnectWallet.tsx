import { useEffect, useState } from 'react';
import { useResponsiveTruncate } from '../../utils/responsiveTruncate';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth';
import ConnectingDialog from '../auth/ConnectingDialog';

const ConnectWallet = () => {
  const { isConnected, connect, isConnecting } = useAuth();

  const truncateAddress = useResponsiveTruncate();

  return (
    <>
      {isConnected ? (
        <div className="pl-1 pr-4 py-1 bg-[#f9fafe] rounded-[100px] border border-[#e9eaf1] justify-between items-center inline-flex">
          <img src="/assets/profile_icon.svg" alt="Profile Icon" className="w-10 h-10" />
          <div className="flex flex-col xl:flex-row justify-center items-center">
            <span className="text-[#212425] text-sm font-semibold pl-2">My Account:</span>
            <span className="text-slate text-sm pl-1">
              {truncateAddress('5obapm-2iaaa-aaaak-qcgca-cai')}
            </span>
          </div>
        </div>
      ) : (
        <button
          onClick={connect}
          className="bg-charcoal text-white px-5 py-1 text-center text-sm font-semibold leading-[48px] rounded-full hover:scale-105 duration-100 transition-all"
        >
          Connect wallet
        </button>
      )}

      {isConnecting && <ConnectingDialog />}
    </>
  );
};

export default ConnectWallet;
