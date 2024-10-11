// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import SearchBar from '../Bar/SearchBar';
import Header from '../Header/Header';
import WalletPanel from '../Panels/WalletPanel';
import MyNFTSPanel from '../Panels/MyNFTsPanel';
import TransferModal from '../Modals/TransferModal';
import ManageModal from '../Modals/ManageModal';
import CheckboxBar from '../Bar/CheckBoxBar';
import { CollectionType } from '../../types/global';
import { useGetCollectionsList } from '../../hooks/useGetCollectionsList';
import { useAuth } from '../../auth/index';
import ConnectWallet from '../Buttons/ConnectWallet';
import { Link } from 'react-router-dom';
import { useUserProfile } from '../../context/UserProfileContext';

const ProfilePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [allCollections, setAllCollections] = useState<CollectionType[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<CollectionType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'Wallet' | 'My NFTs'>('Wallet');

  const { data } = useGetCollectionsList(0, itemsPerPage);
  const { isConnected } = useAuth();
  const { userProfile, isLoading, error } = useUserProfile();

  useEffect(() => {
    if (data) {
      setAllCollections(data.collections);
      setFilteredCollections(data.collections);
      setTotalPages(data.totalPages);
    }
  }, [data]);

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

  const toggleCheckbox = (name: string) => {
    const updatedItems = allCollections.map((item) => {
      const itemName = item.name;
      return itemName === name ? { ...item, checked: !item.checked } : item;
    });

    setAllCollections(updatedItems);

    const filtered = updatedItems.filter((item) => item.checked);

    setFilteredCollections(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  return (
    <div className="relative">
      {/* Overlay Connect Wallet */}
      {!isConnected && !userProfile && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm z-50">
          <p className="text-lg text-gray-700 mb-4 w-3/4 text-center xl:w-full">
            Please press the "Connect Wallet" button below to access your profile.
          </p>
          <ConnectWallet />
          <Link to="/" className="hover:underline pt-4 ">
            Back to Collections
          </Link>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`bg-gradient-to-b from-white to-[#f7f7f7] flex flex-col items-center w-full min-h-screen ${
          !isConnected ? 'blur-sm' : ''
        }`}
      >
        <Header />
        <div className="w-full mt-2 mb-1 px-6 md:hidden">
          <h1 className="text-lg font-semibold">My Account</h1>
        </div>

        <div className="flex w-full h-full border-mouse border-y">
          {/* Tabs for mobile */}
          <div className="w-full md:hidden">
            <div className="flex border-b border-gray-300">
              <button
                className={`flex-1 py-2 border-r border-gray-300 ${
                  activeTab === 'Wallet'
                    ? 'border-b-2 border-b-charcoal text-charcoal font-semibold'
                    : 'text-slate'
                }`}
                onClick={() => setActiveTab('Wallet')}
              >
                Wallet
              </button>
              <button
                className={`flex-1 py-2 ${
                  activeTab === 'My NFTs'
                    ? 'border-b-2 border-charcoal text-charcoal font-semibold'
                    : 'text-slate'
                }`}
                onClick={() => setActiveTab('My NFTs')}
              >
                My NFTs
              </button>
            </div>
            <div className="mt-4">
              {activeTab === 'Wallet' && (
                <WalletPanel
                  onTransferClick={handleOpenTransferModal}
                  onManageClick={handleOpenManageModal}
                />
              )}
              {activeTab === 'My NFTs' && (
                <MyNFTSPanel
                  searchTerm={searchTerm}
                  handleSearch={handleSearch}
                  filteredCollections={filteredCollections}
                  toggleCheckbox={toggleCheckbox}
                />
              )}
            </div>
          </div>

          {/* Layout pour écrans larges (hidden sur mobile) */}
          <div className="hidden md:flex w-full">
            <WalletPanel
              onTransferClick={handleOpenTransferModal}
              onManageClick={handleOpenManageModal}
            />
            <div className="ml-0 md:ml-[33%] lg:ml-[25%] w-full md:w-3/4 bg-gray-100 flex flex-col flex-grow items-center overflow-y-auto min-h-screen">
              <div className="flex flex-col sm:flex-row justify-between w-full px-6 md:px-[76px] mt-6 space-y-6 sm:space-y-0 sm:space-x-12">
                <CheckboxBar collections={allCollections} toggleCheckbox={toggleCheckbox} />
                <SearchBar
                  handleSearch={handleSearch}
                  placeholder="Search for a specific collection"
                />
              </div>
              {/* Intégrez ici la liste des NFTs si nécessaire */}
              {/* <div className="px-6 md:px-[16px] w-full ">
                <CollectionsList
                  collections={filteredCollections}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  setItemsPerPage={setItemsPerPage}
                  loading={isLoading}
                />
              </div> */}
            </div>
          </div>
        </div>

        {/* Modals */}
        {showTransferModal && <TransferModal onClose={handleCloseTransferModal} />}
        {showManageModal && <ManageModal onClose={handleCloseManageModal} />}
      </div>
    </div>
  );
};

export default ProfilePage;
