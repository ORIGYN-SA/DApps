import {
  Flex,
  SecondaryNav,
} from '@origyn-sa/origyn-art-ui';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuestContainer } from '../../components/GuestContainer';
import { AllNfts, dataStructures, Minter } from './Tabs';
import { DataStructure } from './Tabs/DataStrucuter';
import { Template } from './Tabs/Template';
import { useSnackbar } from 'notistack';
const MintingPage = () => {
  const [loggedIn, setLoggedIn] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [nftList, setNftList] = useState([]);
  const [pagination, setPagination] = useState<any>();
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [dataStructure, setDataStructure] = useState<any>(
    JSON.parse(localStorage.getItem('dataStructure')) || dataStructures,
  );

  const handleLogOut = () => {
    setLoggedIn('');
    localStorage.removeItem('apiKey');
    setNftList([]);
  };

  const fetchData = async (page: number) => {
    const response = await fetch(
      `https://development.canister.origyn.ch/canister/v0/nft-token?sortKey=createdAt&sortDirection=-1&skip=${
        30 * (page - 1)
      }`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-api-key': loggedIn,
        },
      },
    );
    const data = await response.json();
    console.log(data);
    setNftList(data.data);
    setPagination(data.cursor);
    setIsLoading(false);
    return data;
  };

  const addData = (dataObject) => {
    const newData = {
      ...dataStructure,
      IGI: [...dataStructure.IGI, dataObject],
    };
    console.log(newData);
    localStorage.setItem('dataStructure', JSON.stringify(newData));
    setDataStructure(newData);
  };
  const removeData = (fileId) => {
    const newData = {
      ...dataStructure,
      IGI: dataStructure.IGI.filter(({ name }) => name !== fileId),
    };
    console.log(newData);
    localStorage.setItem('dataStructure', JSON.stringify(newData));
    setDataStructure(newData);
  };

  useEffect(() => {
    if (loggedIn) {
      console.log(loggedIn);
      localStorage.setItem('apiKey', loggedIn);
      fetchData(1);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      fetchData(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    console.log(localStorage.getItem('apiKey'));
    setLoggedIn(localStorage.getItem('apiKey'));
  }, []);

  return (
    <>
      {loggedIn ? (
        <Flex fullWidth padding="0" flexFlow="column">
          <SecondaryNav
            title="Vault"
            tabs={[
              { title: 'NFTs', id: 'NFTs' },
              { title: 'Minter', id: 'Minter' },
              { title: 'Data Structure', id: 'dataStructure' },
              { title: 'Template', id: 'template' },
            ]}
            content={[
              <AllNfts
                key="1"
                isLoading={isLoading}
                pagination={pagination}
                onPageChange={setCurrentPage}
                nfts={nftList ?? []}
              />,
              <Minter />,
              <DataStructure
                isLoading={false}
                dataStructure={dataStructure.IGI}
                removeData={removeData}
                addData={addData}
              />,
              <Template />,
            ]}
            onLogOut={handleLogOut}
            principal={loggedIn}
          />
        </Flex>
      ) : (
        <GuestContainer onLogin={setLoggedIn} />
      )}
    </>
  );
};

export default MintingPage;
