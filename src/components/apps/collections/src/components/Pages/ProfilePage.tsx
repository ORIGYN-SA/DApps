import React, { useEffect, useState, useMemo, useCallback } from 'react';
import SearchBar from '../Bar/SearchBar';
import Header from '../Header/Header';
import WalletPanel from '../Panels/WalletPanel';
import MyNFTSPanel from '../Panels/MyNFTsPanel';
import TransferModal from '../Modals/TransferModal';
import ManageModal from '../Modals/ManageModal';
import CheckboxBar from '../Bar/CheckBoxBar';
import { useGetCollectionsList } from '../../hooks/useGetCollectionsList';
import { useAuth } from '../../auth/index';
import ConnectWallet from '../Buttons/ConnectWallet';
import { Link } from 'react-router-dom';
import { useUserProfile } from '../../context/UserProfileContext';
import { CollectionType } from '../../types/global';  // Assurez-vous que ce type est bien défini

const ProfilePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'Wallet' | 'My NFTs'>('Wallet');
  const [allCollections, setAllCollections] = useState<CollectionType[]>([]);  // Corrected type
  const [filteredCollections, setFilteredCollections] = useState<CollectionType[]>([]);  // Corrected type
  
  const { data } = useGetCollectionsList(0, 20);
  const { isConnected } = useAuth();
  const { userProfile, isLoading } = useUserProfile();

  useEffect(() => {
    if (data) {
      setFilteredCollections(data.collections);
    }
  }, [data]);

  const toggleCheckbox = useCallback((name: string) => {
    setFilteredCollections(prev => 
      prev.map(item => 
        item.name === name ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const handleSearch = useCallback(term => {
    setSearchTerm(term);
  }, []);

  const handleModal = useCallback((type: 'transfer' | 'manage', status: boolean) => {
    type === 'transfer' ? setShowTransferModal(status) : setShowManageModal(status);
  }, []);

  const renderWalletContent = useMemo(() => (
    <WalletPanel 
      onTransferClick={() => handleModal('transfer', true)} 
      onManageClick={() => handleModal('manage', true)} 
    />
  ), [handleModal]);

  const renderNFTContent = useMemo(() => (
    <MyNFTSPanel
      searchTerm={searchTerm}
      handleSearch={handleSearch}
      filteredCollections={filteredCollections}
      toggleCheckbox={toggleCheckbox}
    />
  ), [searchTerm, filteredCollections, handleSearch, toggleCheckbox]);

  return (
    <div className="relative">
      {!isConnected && !userProfile && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm z-50">
          <p className="text-lg text-gray-700 mb-4 w-3/4 text-center xl:w-full">
            Please press the "Connect Wallet" button below to access your profile.
          </p>
          <ConnectWallet />
          <Link to="/" className="hover:underline pt-4 ">Back to Collections</Link>
        </div>
      )}

      <div className={`bg-gradient-to-b from-white to-[#f7f7f7] flex flex-col items-center w-full min-h-screen ${!isConnected ? 'blur-sm' : ''}`}>
        <Header />
        <div className="w-full mt-2 mb-1 px-6 md:hidden">
          <h1 className="text-lg font-semibold">My Account</h1>
        </div>

        <div className="flex w-full h-full border-mouse border-y">
          <div className="w-full md:hidden">
            <div className="flex border-b border-gray-300">
              <button
                className={`flex-1 py-2 border-r border-gray-300 ${activeTab === 'Wallet' ? 'border-b-2 border-b-charcoal text-charcoal font-semibold' : 'text-slate'}`}
                onClick={() => setActiveTab('Wallet')}
              >
                Wallet
              </button>
              <button
                className={`flex-1 py-2 ${activeTab === 'My NFTs' ? 'border-b-2 border-charcoal text-charcoal font-semibold' : 'text-slate'}`}
                onClick={() => setActiveTab('My NFTs')}
              >
                My NFTs
              </button>
            </div>
            <div className="mt-4">
              {activeTab === 'Wallet' ? renderWalletContent : renderNFTContent}
            </div>
          </div>

          <div className="hidden md:flex w-full">
            {renderWalletContent}
            <div className="ml-0 md:ml-[33%] lg:ml-[25%] w-full md:w-3/4 bg-gray-100 flex flex-col flex-grow items-center overflow-y-auto min-h-screen">
              <div className="flex flex-col sm:flex-row justify-between w-full px-6 md:px-[76px] mt-6 space-y-6 sm:space-y-0 sm:space-x-12">
                <CheckboxBar collections={filteredCollections} toggleCheckbox={toggleCheckbox} />
                <SearchBar handleSearch={handleSearch} placeholder="Search for a specific collection" />
              </div>
            </div>
          </div>
        </div>

        {showTransferModal && <TransferModal onClose={() => handleModal('transfer', false)} />}
        {showManageModal && <ManageModal onClose={() => handleModal('manage', false)} />}
      </div>
    </div>
  );
};

export default ProfilePage;
