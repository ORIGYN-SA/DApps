// src/components/Panels/WalletPanel.tsx
import React from 'react';
import { useIdentityKit } from '@nfid/identitykit/react';
import { useTokenData } from '../../context/TokenDataContext';
import { useResponsiveTruncate } from '../../utils/responsiveTruncate';
import { CopyButton } from '../Buttons/CopyButton';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../context/UserProfileContext';
import Loader from '../Loader';

const WalletPanel = ({ onTransferClick, onManageClick }) => {
  const { disconnect } = useIdentityKit();
  const { getLogo, isLoading: isTokenDataLoading } = useTokenData();
  const { userProfile, isLoading: isUserProfileLoading, error } = useUserProfile();

  const truncateAddress = useResponsiveTruncate();
  const navigate = useNavigate();

  const handleDisconnect = () => {
    disconnect();
    navigate('/');
  };

  if (isTokenDataLoading || isUserProfileLoading || !userProfile) {
    return (
      <div className="md:fixed top-[90px] left-0 md:w-1/3 lg:w-1/4 h-[calc(100vh-90px)] bg-white flex flex-col items-center justify-center shadow-lg">
        <Loader size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:fixed top-[90px] left-0 md:w-1/3 lg:w-1/4 h-[calc(100vh-90px)] bg-white flex flex-col items-center justify-center shadow-lg">
        <p className="text-red-500">Error loading profile: {error.message}</p>
      </div>
    );
  }

  const renderProfileHeader = () => (
    <div className="h-14 flex items-center gap-[29px] px-3 mb-2 md:p-6 md:my-6">
      <img
        src={userProfile.profileImage || '/assets/profile_icon.svg'}
        alt="profile"
        className="md:w-16 md:h-16 xl:w-20 xl:h-20 rounded-full"
      />
      <div className="flex flex-col">
        <div className="text-[#69737c] text-base">Welcome back</div>
        <div className="text-[#212425] text-[16px] xl:text-[24px] font-bold">
          {truncateAddress(userProfile.name)}
        </div>
      </div>
    </div>
  );

  const renderWalletBalance = () => (
    <div className="px-3 3xl:px-6">
      <div className="py-2 px-3 3xl:px-6 bg-white w-full rounded-[20px] border border-[#e1e1e1] flex-col justify-center items-center gap-2">
        <p className="text-center text-[#69737c] text-[22px] font-normal mb-2">Wallet Balance</p>
        <div className="pl-1 pr-4 w-full py-1 bg-[#f9fafe] rounded-[100px] border border-[#e9eaf1] justify-between items-center inline-flex">
          <img src="/assets/profile_icon.svg" alt="Profile Icon" className="w-10 h-10" />
          <div className="flex flex-col xl:flex-row justify-center items-center w-3/4 md:w-[60%]">
            <span className="text-[#212425] text-sm">Account ID:</span>
            <span className="text-[#212425] text-sm font-semibold pl-2">
              {truncateAddress(userProfile.walletAddress)}
            </span>
          </div>
          <CopyButton text={userProfile.walletAddress} />
        </div>
      </div>
    </div>
  );

  const renderBalances = () => {
    console.log('User Balances:', userProfile.balances);
    return (
      <div className="md:flex-grow md:overflow-y-auto space-y-4 py-3 border-[#e1e1e1] mx-3 3xl:mx-6">
        {userProfile.balances.length > 0 ? (
          userProfile.balances.map((balance, index) => (
            <div
              key={index}
              className="px-5 py-6 w-full bg-white rounded-[20px] border border-[#e1e1e1] flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <img
                  src={balance.logo || '/assets/default_logo.svg'}
                  alt={balance.currency}
                  className="w-6 h-6"
                />
                <p className="text-[#212425] text-base font-bold">
                  {balance.amount} {balance.currency}
                </p>
              </div>
              {balance.totalUSD > 0 ? (
                <p className="text-[#69737c] text-[13px]">${balance.totalUSD.toFixed(2)}</p>
              ) : (
                <p className="text-[#69737c] text-[13px]"></p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-[#69737c]">No balances available</p>
        )}
      </div>
    );
  };

  const renderButtons = () => (
    <div className="px-3 3xl:px-6">
      <div className="flex flex-col justify-center items-center gap-2">
        <button
          className="w-full px-[25px] bg-[#212425] rounded-[100px] justify-center items-center gap-2.5 inline-flex"
          onClick={onTransferClick}
        >
          <div className="text-white text-sm font-semibold leading-[48px] text-center">
            Transfer token
          </div>
        </button>
        <button
          className="w-full px-[25px] bg-[#e1e1e1] rounded-[100px] justify-center items-center gap-2.5 inline-flex"
          onClick={onManageClick}
        >
          <div className="text-[#212425] text-sm font-semibold leading-[48px] text-center">
            Manage token
          </div>
        </button>
      </div>
    </div>
  );

  const renderLogOut = () => (
    <div className="p-2 md:p-4">
      <button
        className="text-[#69737c] hover:underline text-[10px] font-medium uppercase tracking-widest w-full"
        onClick={handleDisconnect}
      >
        Log out
      </button>
    </div>
  );

  return (
    <div className="md:fixed top-[90px] left-0 md:w-1/3 lg:w-1/4 h-[calc(100vh-90px)] bg-gradient-to-l from-[#FFF] to-[#F7F7F7] flex flex-col shadow-lg">
      {renderProfileHeader()}
      {renderWalletBalance()}
      {renderBalances()}
      <div className="text-[#69737c] text-xs text-center py-2">Last update: 11/08/2024 19:19</div>
      {renderButtons()}
      {renderLogOut()}
    </div>
  );
};

export default WalletPanel;
