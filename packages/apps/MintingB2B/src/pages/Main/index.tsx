import {
  Flex,
  SecondaryNav,
} from '@origyn-sa/origyn-art-ui';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuestContainer } from '../../components/GuestContainer';
import { AllNfts, dataStructures, formTemplate,  Minter } from './Tabs';
import { DataStructure } from './Tabs/DataStrucuter';
import { Template } from './Tabs/Template';
import { useSnackbar } from 'notistack';
const MintingPage = () => {
  const [loggedIn, setLoggedIn] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLogIn, setIsLoadingLogIn] = useState(false);
  const [isDataStructureLoading, setIsDataStructureLoading] = useState(false);
  
  const [nftList, setNftList] = useState([]);
  const [pagination, setPagination] = useState<any>();
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [dataStructure, setDataStructure] = useState<any>(
    JSON.parse(localStorage.getItem('dataStructure')) || dataStructures,
  );
  const [formTemplateData, setFormTemplateData] = useState<any>(
    JSON.parse(localStorage.getItem('formTemplate')) || formTemplate,
  );
  const { enqueueSnackbar } = useSnackbar();

  const handleLogOut = () => {
    setLoggedIn('');
    localStorage.removeItem('apiKey');
    setNftList([]);
  };

  const fetchData = async (page: number) => {
    setIsLoading(true);
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
          'x-access-token': loggedIn,
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
    const ds = JSON.parse(localStorage.getItem('dataStructure'));
    const ft = JSON.parse(localStorage.getItem('formTemplate'));
    const newData = {
      ...ds || dataStructure,
      IGI: [...(ds || dataStructure).IGI, dataObject],
    };
    console.log(newData);
    const newFormTemplate = {
      ...(ft || formTemplateData)
    };
    (ft || formTemplateData).IGI[0].fields.push(dataObject)
    localStorage.setItem('dataStructure', JSON.stringify(newData));
    localStorage.setItem('formTemplate', JSON.stringify(newFormTemplate));
    setDataStructure(newData);
    setFormTemplateData(newFormTemplate);
  };
  const removeData = (fileId) => {
    setIsDataStructureLoading(true);
    const ds = JSON.parse(localStorage.getItem('dataStructure'));
    const ft = JSON.parse(localStorage.getItem('formTemplate'));
    const newData = {
      ...ds || dataStructure,
      IGI: (ds || dataStructure).IGI.filter(({ name }) => name !== fileId),
    };
    const newFormTemplate = {
      ...(ft || formTemplateData),
      IGI: (ft || formTemplateData).IGI.map((t) => ({...t, fields: t?.fields?.filter(({ name }) => name !== fileId)})),
    };
    localStorage.setItem('dataStructure', JSON.stringify(newData));
    localStorage.setItem('formTemplate', JSON.stringify(newFormTemplate));
    setDataStructure(newData);
    setFormTemplateData(newFormTemplate);
    setIsDataStructureLoading(false);
  };

  const logIn = async (email, password) => {
    setIsLoadingLogIn(true);
    try {
      const response = await fetch(
        `https://development.canister.origyn.ch/user/v0/user/authenticate`,
        {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          body: JSON.stringify({
            mail: email,
            password,
            "jwt": "true",
          }),
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        },
      );
      console.log(response);
      const d = await response.json();
      if (d.status === "Error") {
        enqueueSnackbar(
          d.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      }
      console.log(d);
      setLoggedIn(d.accessToken);
    } catch (err) {
      enqueueSnackbar("Error during log in", {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    }
    setIsLoadingLogIn(false);
  }

  useEffect(() => {
    if (loggedIn) {
      console.log(loggedIn);
      localStorage.setItem('apiKey', loggedIn);
      localStorage.setItem('keyExpiration', ((new Date).getTime() + (1*60*60*1000)).toString());
      fetchData(1);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      fetchData(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    if (parseInt(localStorage.getItem('keyExpiration')) < (new Date).getTime()) {
      localStorage.setItem('apiKey', "");
    } else {
      setLoggedIn(localStorage.getItem('apiKey'));
    }
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
                isLoading={isDataStructureLoading}
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
        <GuestContainer onLogin={logIn} isLoading={isLoadingLogIn} />
      )}
    </>
  );
};

export default MintingPage;
