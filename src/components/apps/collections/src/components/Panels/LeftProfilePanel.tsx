import { useIdentityKit } from '@nfid/identitykit/react';
import { useTokenData } from '../../context/TokenDataContext';
import { useResponsiveTruncate } from '../../utils/responsiveTruncate';
import { CopyButton } from '../Buttons/CopyButton';
import { useNavigate } from 'react-router-dom';

const LeftProfilePanel = ({ user, onTransferClick, onManageClick }) => {
  const { disconnect } = useIdentityKit();
  const { getUSDPrice } = useTokenData();
  const truncateAddress = useResponsiveTruncate();
  const navigate = useNavigate();

  const ogyToUsd = (user.balance.OGY * (getUSDPrice('OGY') || 0)).toFixed(2);
  const icpToUsd = (user.balance.ICP * (getUSDPrice('ICP') || 0)).toFixed(2);

  const handleDisconnect = () => {
    disconnect();
    navigate('/');
  };

  return (
    <div className="fixed top-[90px] left-0 md:w-1/3 lg:w-1/4 h-[calc(100vh-90px)] bg-white flex flex-col shadow-lg">
      {/* User Profile */}
      <div className="h-20 flex items-center gap-[29px] p-6 my-6">
        <img
          src={user.profileImage || '/assets/profile_icon.svg'}
          alt="profile"
          className="md:w-16 md:h-16 xl:w-20 xl:h-20 rounded-full"
        />
        <div className="flex flex-col">
          <div className="text-[#69737c] text-base font-normal">Welcome back</div>
          <div className="text-[#212425] text-[24px] font-bold">{truncateAddress(user.name)}</div>
        </div>
      </div>

      {/* Wallet Balance */}
      <div className="px-3 3xl:px-6">
        <div className="py-2 px-3 3xl:px-6 bg-white w-full rounded-[20px] border-x border border-[#e1e1e1] flex-col justify-center items-center gap-2 flex">
          <div className=" w-full">
            <p className="text-center text-[#69737c] text-[22px] font-normal mb-2">
              Wallet Balance
            </p>
            <div className="pl-1 pr-4 w-full py-1 bg-[#f9fafe] rounded-[100px] border border-[#e9eaf1] justify-between items-center inline-flex">
              <img src="/assets/profile_icon.svg" alt="Profile Icon" className="w-10 h-10" />
              <div className="flex flex-col xl:flex-row justify-center items-center w-[60%]">
                <span className="text-[#212425] text-sm font-normal">Account ID:</span>
                <span className="text-[#212425] text-sm font-semibold pl-2">
                  {truncateAddress(user.walletAddress)}
                </span>
              </div>
              <CopyButton text={user.walletAddress} />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Section */}
      <div className="flex-grow overflow-y-auto space-y-4 py-3 border-[#e1e1e1] mx-3 3xl:mx-6">
        <div className="max-h-min overflow-y-auto space-y-2">
          {/* Loop over balances */}
          <div className="px-5 py-6 w-full bg-white rounded-[20px] border border-[#e1e1e1] justify-between items-center inline-flex">
            <div className="flex flex-row items-center gap-2">
              <img src="/assets/OGY_Icon.svg" alt="OGY" className="w-6 h-6" />
              <p className="text-[#212425] text-base font-bold">{user.balance.OGY} OGY</p>
            </div>
            <p className="text-[#69737c] text-[13px] font-normal leading-none">(${ogyToUsd})</p>
          </div>

          {/* ICP Balance */}
          <div className="px-5 py-6 w-full bg-white rounded-[20px] border border-[#e1e1e1] justify-between items-center inline-flex">
            <div className="flex flex-row items-center gap-2">
              <img src="/assets/IC_Icon.svg" alt="ICP" className="w-6 h-6" />
              <p className="text-[#212425] text-base font-bold">{user.balance.ICP} ICP</p>
            </div>
            <p className="text-[#69737c] text-[13px] font-normal leading-none">(${icpToUsd})</p>
          </div>

          {/* Repeatable content */}
        </div>
      </div>

      <div className="text-[#69737c] text-xs text-center font-medium leading-none py-2">
        Last update: 11/08/2024 19:19
      </div>

      {/* Buttons to open modals */}
      <div className="px-3 3xl:px-6">
        <div className="self-stretch h-[104px] flex flex-col justify-center items-center gap-2">
          <button
            className="self-stretch px-[25px] bg-[#212425] rounded-[100px] justify-center items-center gap-2.5 inline-flex"
            onClick={onTransferClick}
          >
            <div className="text-center text-white text-sm font-semibold leading-[48px]">
              Transfer token
            </div>
          </button>
          <button
            className="self-stretch cursor-default px-[25px] bg-[#e1e1e1] rounded-[100px] justify-center items-center gap-2.5 inline-flex"
            // onClick={onManageClick}
          >
            <div className="text-center text-[#212425] text-sm font-semibold leading-[48px]">
              Manage token
            </div>
          </button>
        </div>
      </div>

      {/* Log out button */}
      <div className="p-4" onClick={handleDisconnect}>
        <button className="text-[#69737c] hover:underline text-[10px] font-medium font-['DM Sans'] uppercase leading-none tracking-widest w-full">
          Log out
        </button>
      </div>
    </div>
  );
};

export default LeftProfilePanel;
