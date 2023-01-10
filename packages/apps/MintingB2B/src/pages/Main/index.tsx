import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  HR,
  SecondaryNav,
  useStepper,
} from '@origyn-sa/origyn-art-ui';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddFile, AddHistory, Form as MetadataForm } from '../../components/forms';
import { GuestContainer } from '../../components/GuestContainer';
import { MediaList, HistoryList } from '../../components/lists';
import { AllNfts, Minter } from './Tabs';
import { DataStructure } from './Tabs/DataStrucuter';
import { Template } from './Tabs/Template';
import { useSnackbar } from 'notistack';
export const dataStructures = {
  IGI: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      name: 'report_date',
      type: 'text',
      label: 'Report Date',
      inputType: 'date',
    },
    {
      name: 'report_number',
      type: 'text',
      label: 'Report Number',
      inputType: 'number',
    },
    {
      name: 'grading_carat_weight',
      label: 'Carat Weight',
      inputType: 'number',
      type: 'text',
      sectionHeader: 'Grading Results',
    },
    {
      name: 'grade_cut',
      label: 'Shape & Cut Description',
      type: 'text',
    },
    {
      name: 'grade_polish',
      label: 'Polish',
      type: 'text',
      inputType: 'select',
      options: ['Excellent', 'Very good', 'Good', 'Fair', 'Poor'],
      sectionHeader: 'Additional Grading Information',
    },
    {
      name: 'grade_symmetry',
      label: 'Symmetry',
      type: 'text',
      inputType: 'select',
      options: ['Excellent', 'Very good', 'Good', 'Fair', 'Poor'],
    },
    {
      name: 'grade_fluorescence',
      label: 'Fluorescence',
      type: 'text',
      inputType: 'select',
      options: ['None', 'Faint', 'Medium', 'Strong', 'Very Strong'],
    },
    {
      name: 'grade_comments',
      label: 'Comments',
      type: 'text',
      inputType: 'largeText',
    },
    {
      name: 'origyn-mints-diamonds-shape',
      label: 'Shape',
      type: 'text',
      inputType: 'select',
      options: [
        'Asher',
        'Cushion',
        'Emerald',
        'Heart',
        'Marquise',
        'Oval',
        'Pear',
        'Princess',
        'Radiant',
        'Round',
      ],
      sectionHeader: 'Custom',
    },
    {
      name: 'origyn-mints-diamonds-color',
      label: 'Color',
      type: 'text',
      inputType: 'select',
      options: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ],
    },
    {
      name: 'origyn-mints-diamonds-clarity',
      label: 'Clarity',
      type: 'text',
      inputType: 'select',
      options: ['IF', 'VVS 1', 'VVS 2', 'VS 1', 'SI 1', 'SI 2', 'I 1', 'I 2', 'I 3'],
    },
    {
      name: 'origyn-mints-diamonds-table',
      label: 'Table',
      type: 'text',
      inputType: 'number',
      sectionHeader: 'Proportions',
    },
    {
      name: 'origyn-mints-diamonds-depth',
      label: 'Depth',
      type: 'text',
      inputType: 'number',
    },
    {
      name: 'origyn-mints-diamonds-culet',
      label: 'Culet',
      type: 'text',
      inputType: 'select',
      options: ['Very Small', 'Small', 'Medium', 'Large', 'Very Large', 'Pointed'],
    },
    {
      name: 'origyn-mints-diamonds-ugirdle',
      label: 'Crown',
      type: 'text',
      inputType: 'number',
    },
    {
      name: 'origyn-mints-diamonds-lgirdle',
      label: 'Pavilion',
      type: 'text',
      inputType: 'number',
    },
    {
      name: 'origyn-mints-diamonds-angle',
      label: 'Angle',
      type: 'text',
      inputType: 'select',
      options: [
        'Extremely Thin',
        'Very Thin',
        'Thin',
        'Slightly Thin',
        'Medium',
        'Slightly Thick',
        'Thick',
        'Very Thick',
        'Extremely Thick',
      ],
    },
    {
      name: 'origyn-mints-diamonds-length',
      label: 'Length',
      type: 'text',
      inputType: 'number',
    },
    {
      name: 'origyn-mints-diamonds-width',
      label: 'Width',
      type: 'text',
      inputType: 'number',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      inputType: 'largeText',
      sectionHeader: 'Description',
    },
    {
      type: 'records',
      name: 'origyn-mints-history',
    },
    // {
    //   type: 'records',
    //   name: 'origyn-mints-files',
    // },

    // {
    //   type: 'media',
    //   name: 'origyn-mints-images',
    // },
  ],
  Luxury: {},
};

const MintingPage = () => {
  const [loggedIn, setLoggedIn] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const navigate = useNavigate();
  const [nftList, setNftList] = useState([]);
  const [pagination, setPagination] = useState<any>();
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [metadata, setMetadata] = useState<any>();
  const [files, setFiles] = useState<any>([]);
  const [offChainHistory, setOffChainHistory] = useState<any>([]);
  const [dataStructure, setDataStructure] = useState<any>(
    JSON.parse(localStorage.getItem('dataStructure')) || dataStructures,
  );
  const { enqueueSnackbar } = useSnackbar();

  const handleLogOut = () => {
    setLoggedIn('');
    localStorage.removeItem('apiKey');
    setNftList([]);
  };

  const fetchData = async (page: number) => {
    const response = await fetch(
      `http://localhost:3000/canister/v0/nft-token?sortKey=createdAt&sortDirection=-1&skip=${
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

  const addMedia = async (fileObject) => {
    const requestFormData = new FormData();
    requestFormData.append(fileObject.pointer, fileObject.file);
    const response = await fetch(`http://localhost:3000/canister/v0/pre-stage`, {
      method: 'PUT',
      headers: {
        'x-api-key': loggedIn,
      },
      body: requestFormData,
    });
    if (response.status === 200) {
      enqueueSnackbar(`File '${fileObject.fileName}' uploaded`, {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      const body = await response.json();
      const file = {
        id: fileObject.id,
        path: fileObject.fileName,
        source: body?.[0].url,
        pointer: fileObject.pointer,
        download: true,
      };
      setFiles([...files, file]);
    } else {
      enqueueSnackbar(`There was an error while uploading '${fileObject.fileName}'`, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    }
  };
  const addHistory = (historyObject) => {
    setOffChainHistory([...offChainHistory, historyObject]);
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
  const removeFile = (fileId) => {
    setFiles(files.filter(({ id }) => id !== fileId));
  };
  const removeHistory = (fileId) => {
    setOffChainHistory(offChainHistory.filter(({ id }) => id !== fileId));
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

  const mintNft = async (e) => {
    e.preventDefault();
    const formMeta = new FormData(e.target);
    const formDataObj = {};
    formMeta.forEach((value, key) => (formDataObj[key] = value));
    setMetadata(formDataObj);
    setCurrentTab(currentTab + 1);
  };
  const mintFiles = async (e) => {
    e.preventDefault();
    setIsMinting(true);
    try {
      const formFullData = {
        files,
        data: dataStructures.IGI.map(({ name, type }) => ({
          name,
          type,
          value:
            type === 'record'
              ? metadata[name]
              : {
                  language: true,
                  data: {
                    en: metadata[name],
                  },
                },
        })),
        display: {},
      };
      console.log(formFullData);
      const jsonFile = new Blob([JSON.stringify(formFullData, null, 2)], {
        type: 'application/json',
      });

      const requestFormData = new FormData();
      requestFormData.set('appType', 'IGI');

      const file = new File([jsonFile], 'metadata.json', {
        type: 'application/json',
        lastModified: Date.now(),
      });

      requestFormData.set('metadata', file);
      // files.forEach(({ pointer, file }) => {
      //   requestFormData.append(pointer, file);
      // });
      console.log(metadata);

      const response = await fetch(`http://localhost:3000/canister/v0/nft-token`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'x-api-key': loggedIn,
        },
        body: requestFormData,
      });
      if (response.status === 200) {
        const data = await response.json();
        navigate(`/${data?.token?.id}`);
        console.log(data?.token?.id);
      }
      setIsMinting(false);
    } catch (e) {
      setIsMinting(false);
    }
  };
  const saveHistory = async (e) => {
    e.preventDefault();
    setMetadata({
      ...metadata,
      'origyn-mints-history': offChainHistory,
    });
    console.log(metadata);

    setCurrentTab(currentTab + 1);
  };
  const handleMainImg = (e) => {
    const [file] = e.target.files;
    console.log(file);
    setFiles([
      ...files,
      {
        fileName: file.name,
        pointer: 'mainImg',
        preview: URL.createObjectURL(file),
        file,
      },
    ]);
  };

  const [tabs, content, currentTab, setCurrentTab] = useStepper([
    {
      label: 'Metadata',
      content: (
        <>
          <form onSubmit={mintNft}>
            <MetadataForm data={dataStructure.IGI} />
            <br />
            <Flex fullWodth justify="center">
              <Button type="submit">Continue</Button>
            </Flex>
          </form>
        </>
      ),
      id: 'metadata',
    },
    {
      label: 'History',
      content: (
        <>
          <form onSubmit={saveHistory}>
            <br />
            <h6>Off-chain History</h6>
            <br />
            <HR />
            <br />
            <Card padding="8px">
              <Flex fullWidth flexFlow="column" gap={8}>
                <h6>Add off-chain history</h6>
                <HistoryList items={offChainHistory} onRemoveClick={removeHistory} />
                <AddHistory handleAdd={addHistory} />
              </Flex>
            </Card>
            <br />
            <Flex fullWodth justify="center">
              <Button type="submit">Continue</Button>
            </Flex>
          </form>
        </>
      ),
      id: 'history',
    },
    {
      label: 'Files',
      content: (
        <>
          <form onSubmit={mintFiles}>
            <br />
            <h6>Files</h6>
            <br />
            <HR />
            <br />
            <label htmlFor="main_image">
              <Card padding="8px">
                <Flex fullWidth justify="space-between" align="center">
                  <h6>Main image</h6>
                  <img
                    height={50}
                    src={files.find(({ pointer }) => pointer === 'mainImg')?.preview}
                    alt=""
                  />
                  <input
                    id="main_image"
                    type="file"
                    accept="image/*"
                    name="main_image"
                    onChange={handleMainImg}
                  />
                </Flex>
              </Card>
            </label>
            <br />
            <Card padding="8px">
              <Flex fullWidth flexFlow="column" gap={8}>
                <h6>Media</h6>
                <MediaList
                  items={files.filter(({ pointer }) => pointer === 'media')}
                  onRemoveClick={removeFile}
                />

                <AddFile handleAdd={addMedia} pointer="media" />
              </Flex>
            </Card>
            <br />
            <Card padding="8px">
              <Flex fullWidth flexFlow="column" gap={8}>
                <h6>Attachments</h6>
                <MediaList
                  items={files.filter(({ pointer }) => pointer === 'attachments')}
                  onRemoveClick={removeFile}
                />
                <AddFile handleAdd={addMedia} pointer="attachments" />
              </Flex>
            </Card>
            <br />
            <Flex fullWodth justify="center">
              <Button type="submit">Mint</Button>
            </Flex>
          </form>
        </>
      ),
      id: 'files',
    },
  ]);

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
              <Minter key="2" isMinting={isMinting} tabs={tabs} content={content} />,
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
