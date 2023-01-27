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
export const formTemplate = {
  IGI: [
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

const CustomGrid = styled(Grid)`
  grid-template-columns: 4fr 8fr;
`

const CustomFileUpload = styled.label`
  display: flex;
  flex-shrink: 0;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  position: relative;

  width: 148px;
  height: 148px;
  background: #5F5F5F;
  border-radius: 12px;
  cursor: pointer;

  img {
    width: 148px;
    height: 148px;
    position: absolute;
    border-radius: 12px;
    top: 0;
    left: 0;
  }
`

export const Minter = () => {
  const [loggedIn, setLoggedIn] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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

  const mintFiles = async () => {
    setIsMinting(true);
    try {
      const formMeta = new FormData(formRef.current);
      const formDataObj = {};
      formMeta.forEach((value, key) => (formDataObj[key] = value));
      setMetadata(formDataObj);

      const formFullData = {
        files,
        data: dataStructure.IGI.map(({ name, type }) => ({
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
  }, []);

  return (
    <Container padding="16px">
      <br />
      <br />
      <h4>Mint a new Certificate</h4>
      {
        isMinting ? (
          <LoadingContainer />
        ) : (
          <>
            <Grid columns={2}>
              <div>
                <br />
                <p>Manually enter all the fields and upload any necessary images and documents to complete the minting process.</p>
                <br />
                <br />
              </div>
              <Flex align="center" justify="flex-end">
                <Button btnType="filled" onClick={mintFiles}>Submit</Button>
              </Flex>
            </Grid>
            <HR />
            <form ref={formRef}>
              <MetadataForm data={templateFormData.IGI} />
              <br />
            </form>

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

            <CustomGrid>
              <div>
                <h6>Main image</h6>
              </div>
              <CustomFileUpload htmlFor="main_image">
                {console.log(files, files.find(({ pointer }) => pointer === 'media'))}
                <img
                  src={files.find(({ pointer }) => pointer === 'media')?.source}
                />
                <input
                  id="main_image"
                  type="file"
                  accept="image/*"
                  name="main_image"
                  onChange={(e) => {
                    const id = genRanHex(32);
                    const [fileData] = e.target.files;
                    console.log(fileData);
                    const newFile = new File([fileData], id);
                    const data = {
                      fileName: fileData.name,
                      pointer: "media",
                      type: fileData.type,
                      preview: URL.createObjectURL(fileData),
                      file: newFile,
                      id,
                    };
                    addMedia(data);
                  }}
                  style={{ display: 'none' }}
                />
                <PlayForWorkIcon fontSize="large" />
              </CustomFileUpload>
            </CustomGrid>
            <HR marginTop={48} marginBottom={48} />
            <CustomGrid>
              <div>
                <h6>Images & Video</h6>
              </div>
              <div>
                <div>
                  <h6>Upload Images & Videos</h6>
                  <p>Upload all images and videos to display within the certificate.</p>
                </div>
                <br />
                <Flex gap={48}>
                  <MediaList
                    items={files.filter(({ pointer }) => pointer === 'media')}
                    onRemoveClick={removeFile}
                  />
                  <AddFile handleAdd={addMedia} pointer="media" />
                </Flex>
              </div>
            </CustomGrid>
            <HR marginTop={48} marginBottom={48} />
            <CustomGrid>
              <div>
                <h6>Additional Documents</h6>
              </div>
              <div>
                <div>
                  <h6>Upload Additional Documents</h6>
                  <p>Upload any additional documentation</p>
                </div>
                <br />
                <Flex gap={48}>
                  <MediaList
                    items={files.filter(({ pointer }) => pointer === 'attachments')}
                    onRemoveClick={removeFile}
                  />
                  <AddFile handleAdd={addMedia} pointer="attachments" />
                </Flex>
              </div>
            </CustomGrid>
            <HR marginTop={48} marginBottom={48} />
            <Flex align="center" justify="flex-end">
              <Button btnType="filled" onClick={mintFiles}>Submit</Button>
            </Flex>
          </>
        )
      }
    </Container>
  );
};
