import { useEffect, useState } from 'react';
import SearchBar from '../Bar/SearchBar';
import Header from '../Header/Header';
import LeftProfilePanel from '../Panels/LeftProfilePanel';
import TransferModal from '../Modals/TransferModal';
import ManageModal from '../Modals/ManageModal';
import CheckBoxBar from '../Bar/CheckBoxBar';
import { CollectionType } from '../../types/global';
import { useGetCollectionsList } from '../../hooks/useGetCollectionsList';
import CollectionsList from '../Collections/CollectionsList';
import CheckboxBar from '../Bar/CheckBoxBar';
import { useIdentityKit } from '@nfid/identitykit/react';
import { useAuth } from '../../auth/index';
import ConnectWallet from '../Buttons/ConnectWallet'; // Import the ConnectWallet component
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [allCollections, setAllCollections] = useState<CollectionType[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<CollectionType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);

  const { data, isLoading, error } = useGetCollectionsList(0, itemsPerPage);
  const { user, icpBalance, isInitializing } = useIdentityKit();
  const { isConnected, isConnecting } = useAuth();

  useEffect(() => {
    if (data) {
      setAllCollections(data.collections);
      setFilteredCollections(data.collections);
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const userData =
    user && user.principal
      ? {
          name: user.principal.toText(),
          profileImage: '/assets/profile_icon.svg',
          walletAddress: user.principal.toText(),
          balance: {
            OGY: 100,
            ICP: icpBalance,
          },
        }
      : {
          name: 'Guest',
          profileImage: '/assets/profile_icon.svg',
          walletAddress: 'N/A',
          balance: {
            OGY: 0,
            ICP: 0,
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
      {!isConnected && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm z-50">
          <p className="text-lg text-gray-700 mb-4 w-3/4 text-center xl:w-full">
            You are not connected. Please press the "Connect Wallet" button below to access your
            profile.
          </p>
          <ConnectWallet />
          <Link to="/" className="hover:underline pt-4 ">
            Back to Collections
          </Link>
        </div>
      )}
      <div
        className={`bg-gradient-to-b from-white to-[#f7f7f7] flex flex-col items-center w-full min-h-screen ${!isConnected ? 'blur-sm' : ''}`}
      >
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
          <div className="md:ml-[33%] w-1/2 xl:ml-[25%] mt-[90px] md:w-3/4 bg-gray-100 flex flex-col flex-grow items-center overflow-y-auto min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between w-full px-6 md:px-[76px] mt-6 space-y-6 sm:space-y-0 sm:space-x-12">
              <CheckboxBar collections={allCollections} toggleCheckbox={toggleCheckbox} />
              <SearchBar
                handleSearch={handleSearch}
                placeholder="Search for a specific collection"
              />
            </div>
            {/* Uncomment the collections list when ready */}
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

        {showTransferModal && <TransferModal onClose={handleCloseTransferModal} />}
        {showManageModal && <ManageModal onClose={handleCloseManageModal} />}
      </div>
    </div>
  );
};

export default ProfilePage;
