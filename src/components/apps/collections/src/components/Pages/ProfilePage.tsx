import { useState } from 'react';
import SearchBar from '../Bar/SearchBar';
import Header from '../Header/Header';
import LeftProfilePanel from '../Panels/LeftProfilePanel';
import TransferModal from '../Modals/TransferModal';
import ManageModal from '../Modals/ManageModal';

const ProfilePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  // Fake user data
  const userData = {
    name: 'Jane Doe',
    profileImage: '/assets/profile.png',
    walletAddress: '5obapm-2iaaa-aaaak-qcgca-cai',
    balance: {
      OGY: 100,
      ICP: 1,
    },
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleOpenTransferModal = () => {
    setShowTransferModal(true);
  };

  const handleOpenManageModal = () => {
    setShowManageModal(true);
  };

  const handleCloseTransferModal = () => {
    setShowTransferModal(false);
  };

  const handleCloseManageModal = () => {
    setShowManageModal(false);
  };

  return (
    <div className="bg-gradient-to-b from-white to-[#f7f7f7] flex flex-col items-center w-full min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full h-[90px] bg-white flex items-center justify-between z-50">
        <Header />
      </div>
      {/* Layout for LeftPanel and Scrollable Content */}
      <div className="flex w-full h-full">
        {/* Fixed LeftPanel */}
        <LeftProfilePanel
          user={userData}
          onTransferClick={handleOpenTransferModal}
          onManageClick={handleOpenManageModal}
        />
        {/* Scrollable Right Content */}
        <div className="md:ml-[33%] w-1/2 xl:ml-[25%] md:w-3/4 bg-gray-100 flex flex-col flex-grow items-center overflow-y-auto min-h-screen">
          <div className="mt-[90px] flex flex-col items-center justify-center">
            <SearchBar handleSearch={handleSearch} placeholder="Search for a specific NFT" />
            <h1 className="text-3xl font-bold">Your NFTs</h1>
            <p className="text-gray-500 text-sm">
              Browse through your NFTs and interact with them directly from your profile.
            </p>
          </div>
        </div>
      </div>

      {showTransferModal && <TransferModal onClose={handleCloseTransferModal} />}
      {showManageModal && <ManageModal onClose={handleCloseManageModal} />}
    </div>
  );
};

export default ProfilePage;
