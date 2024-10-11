import { useResponsiveTruncate } from '../../utils/responsiveTruncate';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth';
import { useIdentityKit } from '@nfid/identitykit/react';
import Loader from '../Loader';

const ConnectWallet = () => {
  const { isConnected, connect, isConnecting } = useAuth();
  const { user } = useIdentityKit();
  const truncateAddress = useResponsiveTruncate();
  const location = useLocation();

  return (
    <>
      {isConnected ? (
        location.pathname !== '/profile' ? (
          <Link to="/profile">
            <div className="pl-1 pr-4 py-1 hover:shadow transition-all duration-200 bg-[#f9fafe] rounded-[100px] border border-[#e9eaf1] justify-between items-center inline-flex">
              <img src="/assets/profile_icon.svg" alt="Profile Icon" className="w-10 h-10" />
              <div className="flex flex-col xl:flex-row justify-center items-center">
                <span className="text-[#212425] text-sm font-semibold pl-2">My Account:</span>
                <span className="text-slate text-sm pl-1">
                  {truncateAddress(user?.principal?.toText() || 'Guest')}
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="pl-1 pr-4 py-1 bg-[#f9fafe] rounded-[100px] border border-[#e9eaf1] justify-between items-center inline-flex">
            <img src="/assets/profile_icon.svg" alt="Profile Icon" className="w-10 h-10" />
            <div className="flex flex-col xl:flex-row justify-center items-center">
              <span className="text-[#212425] text-sm font-semibold pl-2">My Account:</span>
              <span className="text-slate text-sm pl-1">
                {truncateAddress(user?.principal?.toText() || 'Guest')}
              </span>
            </div>
          </div>
        )
      ) : (
        <button
          onClick={connect}
          disabled={isConnecting}
          className="bg-charcoal text-white px-5 py-1 text-center text-sm font-semibold leading-[48px] rounded-full hover:scale-105 duration-100 transition-all"
        >
          {isConnecting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader size={24} /> Connecting...
            </div>
          ) : (
            'Connect wallet'
          )}
        </button>
      )}
    </>
  );
};

export default ConnectWallet;
