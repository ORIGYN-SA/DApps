import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Card, Flex, Grid, HR, Icons } from '@origyn-sa/origyn-art-ui';
import { AddFile } from '../../../components/forms/AddFile';
import { MediaList, HistoryList } from '../../../components/lists';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { LoadingContainer } from '@dapp/features-components';
import { Form as MetadataForm } from '../../../components/forms';
import styled from 'styled-components';
import { genRanHex } from '@dapp/utils';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';
import { defaultTemplate } from './Template';

export const dataStructures = {
  'Natural Diamond': [
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
    {
      type: 'images',
      name: 'files-mainImage',
      inputType: 'images',
    },
    {
      type: 'images',
      name: 'files-media',
      inputType: 'images',
    },
    {
      type: 'files',
      name: 'files-attachments',
      inputType: 'files',
    },
  ],
  'Laboratory Grown Diamond': [],
};
export const formTemplate = {
  'Natural Diamond': [
    {
      type: 'category',
      title: 'General Info',
      subTitle: 'Manually enter the general information found on the IGI diamond report.',
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
        },
        {
          name: 'files-mainImage',
          label: 'Upload Main Image',
          subLabel: 'Upload the main image you want displayed.',
          pointer: 'files-mainImage',
          inputType: 'images',
        },
        // {
        //   name: 'main_image',
        //   type: 'file',
        //   accept: "image/*",
        //   label: 'Main Image',
        //   inputType: 'file',
        // },
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
          name: 'description',
          label: 'Description',
          type: 'text',
          inputType: 'largeText',
          sectionHeader: 'Description',
        },
        {
          name: 'grading_carat_weight',
          label: 'Carat Weight',
          inputType: 'number',
          type: 'text',
        },
        {
          name: 'grade_cut',
          label: 'Shape & Cut Description',
          type: 'text',
        },
      ]
    },
    {
      type: 'category',
      title: 'Grading Results',
      subTitle: 'Manually enter the grading results found on the IGI diamond report.',
      fields: [
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
      ]
    },
    {
      type: 'category',
      title: 'Additional Grading Information',
      subTitle: 'Manually enter the grading information found on the IGI diamond report.',
      fields: [
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
      ]
    },
    {
      type: 'category',
      title: 'Proportions',
      subTitle: 'Manually enter the proportions found on the IGI diamond report.',
      fields: [
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
      ]
    },
    // {
    //   type: 'category',
    //   title: 'Transfer Type',
    //   subTitle: 'How will this certificate be transferred to the end user?',
    //   fields: [

    //   ]
    // },
    {
      type: 'category',
      title: 'Images & Video',
      fields: [
        {
          name: 'files-media',
          label: 'Images & Video',
          subLabel: "Upload all images and videos to display within the certificate.",
          pointer: 'files-media',
          inputType: 'images',
        },
      ]
    },
    {
      type: 'category',
      title: 'Additional Documents',
      fields: [
        {
          name: 'files-attachments',
          label: 'Upload Additional Documents',
          subLabel: "Upload all images and videos to display within the certificate.",
          pointer: 'files-attachments',
          inputType: 'files',
        },
      ]
    },
  ],
  'Laboratory Grown Diamond': [],
};

const CustomGrid = styled(Grid)`
  grid-template-columns: 4fr 8fr;
  gap: 16px;
`

export const Minter = () => {
  const [loggedIn, setLoggedIn] = useState('');
  const [selectedDataStructure, setSelectedDataStructure] = useState(Object.keys(dataStructures)[0]);
  const [isMinting, setIsMinting] = useState(false);
  const navigate = useNavigate();
  const [metadata, setMetadata] = useState<any>();
  const [files, setFiles] = useState<any>([]);
  const [offChainHistory, setOffChainHistory] = useState<any>([]);
  const [dataStructure, setDataStructure] = useState<any>(
    JSON.parse(localStorage.getItem('dataStructure')) || dataStructures,
  );
  const [templateFormData, setTemplateFormData] = useState<any>(
    JSON.parse(localStorage.getItem('formTemplate')) || formTemplate,
  );
  const formRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const addMedia = async (fileObject) => {
    const requestFormData = new FormData();
    requestFormData.append(fileObject.pointer, fileObject.file);
    const response = await fetch(`https://development.origyn.network/canister/v0/pre-stage/files`, {
      method: 'PUT',
      headers: {
        'x-access-token': loggedIn,
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
      return [...files, file];
    } else {
      enqueueSnackbar(`There was an error while uploading '${fileObject.fileName}'`, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    }
    return files;
  };
  const addHistory = (historyObject) => {
    setOffChainHistory([...offChainHistory, historyObject]);
  };
  const removeFile = (fileId) => {
    setFiles(files.filter(({ id }) => id !== fileId));
  };
  const removeHistory = (fileId) => {
    setOffChainHistory(offChainHistory.filter(({ id }) => id !== fileId));
  };

  const mintFiles = async () => {
    setIsMinting(true);
    try {
      const formMeta = new FormData(formRef.current);
      const formDataObj = {};
      formMeta.forEach((value, key) => (formDataObj[key] = value));
      setMetadata(formDataObj);

      const formFullData = {
        files,
        data: dataStructure[selectedDataStructure]?.map(({ name, type }) => ({
          name,
          type,
          value:
            type === 'images' || type === 'files'
              ? {
                data: files.filter(({pointer}) => pointer ===  name),
              }
              : {
                language: true,
                data: {
                  en: formDataObj[name],
                },
              },
        })),
        display: JSON.parse(localStorage.getItem('template')) || defaultTemplate,
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

      const response = await fetch(`https://development.origyn.network/canister/v0/nft-token`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'x-access-token': loggedIn,
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
      console.log(e);
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
  };

  useEffect(() => {
    setLoggedIn(localStorage.getItem('apiKey'));
    setLoggedIn(localStorage.getItem('apiKey'));
  }, []);

  return (
    <>
      <Container padding="48px 24px 32px">
        <h2>Mint a new Certificate</h2>
        <br />
        <Grid columns={2} align="flex-start" justify="space-between">
          <p>Manually enter all the fields and upload any necessary images and documents to complete the minting process.</p>
          <Flex justify="flex-end">
            <Button btnType="filled" onClick={mintFiles}>Submit</Button>
          </Flex>
        </Grid>
      </Container>
      <HR />
      <Container padding="24px">
        {
          isMinting ? (
            <LoadingContainer />
          ) : (
            <>
              <CustomGrid>
                <h6>Select Data Structure</h6>
                <Grid columns={2} gap={20}>
                  {
                    Object.keys(templateFormData).map((key) => {
                      return (
                        <Card type={key === selectedDataStructure  ? "filled" : "outlined"} padding="32px" onClick={() => setSelectedDataStructure(key)}>
                          <Flex fullWidth flexFlow="column" justify="center" align="center" gap={10}>
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M20.6947 6.995C20.5247 6.685 20.2847 6.435 19.9747 6.255L13.0347 2.145C12.4147 1.785 11.5847 1.785 10.9647 2.145L4.02469 6.255C3.71469 6.435 3.46469 6.685 3.30469 6.995C3.13469 7.305 3.05469 7.645 3.05469 7.995V16.065C3.05469 16.415 3.13469 16.755 3.30469 17.065C3.47469 17.375 3.71469 17.625 4.02469 17.805L10.9347 21.855C11.2447 22.035 11.5847 22.125 11.9347 22.125C12.2847 22.125 12.6247 22.035 12.9347 21.855L19.9347 17.805C20.2447 17.625 20.4947 17.375 20.6747 17.065C20.8547 16.755 20.9447 16.415 20.9447 16.065V7.995C20.9447 7.645 20.8647 7.305 20.6947 6.995ZM10.9347 12.625V19.365L5.21469 15.935V9.345L10.9347 12.625ZM17.7147 7.405L12.0047 10.715L6.29469 7.405L12.0047 4.125L17.7147 7.405ZM18.8147 9.345V15.935L13.0647 19.365V12.625L18.8147 9.345Z" fill="#151515" />
                              </svg>
                            </div>
                            <div>
                              <h6>{key}</h6>
                            </div>
                          </Flex>
                        </Card>
                      )
                    })
                  }
                </Grid>
              </CustomGrid>
              {
                selectedDataStructure && (
                  <>
                    <form ref={formRef}>
                      <MetadataForm
                        data={templateFormData[selectedDataStructure]}
                        addFile={addMedia}
                        removeFile={removeFile}
                      />
                    </form>
                    <Flex align="center" justify="flex-end">
                      <Button btnType="filled" onClick={mintFiles}>Submit</Button>
                    </Flex>
                  </>
                )
              }

              {/* <form onSubmit={saveHistory}>
              <br />
              <h6>Off-chain History</h6>
              <br />
              <HR />
              <br />
              <Card padding="8px">
              </Card>
              <br />
              <Flex fullWodth justify="center">
                <Button type="submit">Continue</Button>
              </Flex>
            </form> */}
            </>
          )
        }
      </Container>
    </>
  );
};
