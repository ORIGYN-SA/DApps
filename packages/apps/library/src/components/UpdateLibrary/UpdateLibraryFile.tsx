import React, { useState, useContext } from 'react';
import { DropzoneArea } from 'mui-file-dropzone';
import { useSnackbar } from 'notistack';
import { AuthContext, useRoute } from '@dapp/features-authentication';
// mint.js
import {
  OrigynClient,
  updateLibraryFileContent,
  updateLibraryMetadata,
  getNftCollectionMeta,
  getNft,
} from '@origyn-sa/mintjs';
import { Button, Modal, Container, Flex, HR, TextInput, Select } from '@origyn-sa/origyn-art-ui';
import { LinearProgress } from '@mui/material';

type Props = {
  tokenId: string;
  updateLibraryData: any;
  setOpenLibrary: any;
  metadata: any;
};
export const UpdateLibraryFile = ({
  tokenId,
  updateLibraryData,
  setOpenLibrary,
  metadata,
}: Props) => {
  const { actor } = useContext(AuthContext);
  // Snackbar
  const { enqueueSnackbar } = useSnackbar();
  // Dialog
  const [open, setOpen] = useState(false);

  const title = metadata.Class?.filter((res) => res.name === 'title')[0].value.Text;
  const read = metadata.Class?.filter((res) => res.name === 'read')[0].value.Text;
  const libraryId = metadata.Class?.filter((res) => res.name === 'library_id')[0].value.Text;
  const readPermissions = ['public', 'owner', 'collection_owner'];

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [inProgress, setInProgress] = useState(false);
  const [typedTitle, setTypedTitle] = useState<string>(title);
  const [selectedRead, setSelectedRead] = useState<string>(read);
  const [updatedFile, setUpdatedFile] = useState<any>(undefined);

  const handleSelectChange = (val) => {
    setSelectedRead(val);
  };

  const getTypedTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedTitle(event.target.value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleFileSelected = (files) => {
    setSelectedFile(files[0]);
  };
  console.log(metadata);

  const handleSubmit = async () => {
    const { canisterId } = await useRoute();

    if (selectedFile) {
      const rawFile = await readFileAsync(selectedFile);
      const file = {
        category: 'collection' as 'collection',
        filename: selectedFile.name,
        index: 0,
        path: `${selectedFile.size}+${selectedFile.name}`,
        size: selectedFile.size,
        type: selectedFile.type,
        rawFile: rawFile,
      };
      setUpdatedFile(file);
    }
    setInProgress(true);
    try {
      await OrigynClient.getInstance().init(true, canisterId, { actor });
      const updateResponse =
        selectedFile != undefined
          ? await updateLibraryFileContent(tokenId, libraryId, updatedFile)
          : null;
      const updateTitle = await updateLibraryMetadata(tokenId, libraryId, { title: typedTitle });
     

      if (updateResponse.ok || updateTitle.ok) {
        // Display a success message - SNACKBAR
        enqueueSnackbar('Library Updated', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        handleClose();
      } else {
        enqueueSnackbar('Something went wrong', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        handleClose();
      }
    } catch (e) {
      console.log('error', e);
      handleClose();
    }
    setInProgress(false);
    if(tokenId == ''){

    //Update the library data for the collection
    getNftCollectionMeta().then((r) => {
      updateLibraryData(
        r.ok.metadata[0].Class.filter((res) => {
          return res.name === 'library';
        })[0].value.Array.thawed,
      );
    });
    setOpenLibrary(false);
  }else{
    //Update the library data for the Token
    getNft(tokenId).then((r) => {
      updateLibraryData(
        r.ok.metadata.Class.filter((res) => {
          return res.name === 'library';
        })[0].value.Array.thawed,
      );
    });
    setOpenLibrary(false);
  }
  };

  const arrayToBuffer = (arrayBuffer) => {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }
    return buffer;
  };

  const readFileAsync = (file: File): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(arrayToBuffer(reader.result));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <>
      <Button onClick={handleClickOpen} btnType="filled">
        Update library file
      </Button>

      <Modal closeModal={handleClose} isOpened={open} mode="light" size="md">
        <Container padding="16px">
          {inProgress ? (
            <>
              <LinearProgress color="secondary" />
            </>
          ) : (
            <>
              <Flex flexFlow="column" gap={16}>
                <Flex>
                  <h4>Update library </h4>
                </Flex>
                <HR marginBottom={16} marginTop={16} />
                <Flex>
                <Container size="full">
                  <Flex flexFlow="column" gap={8}>
                    <Flex>Update library title</Flex>
                    <Flex>
                      <TextInput
                        label="Library title"
                        id="title"
                        placeholder="Enter Library Title"
                        onChange={getTypedTitle}
                        value={typedTitle}
                      />
                    </Flex>
                  </Flex>
                </Container>
                </Flex>
                <HR marginBottom={16} marginTop={16} />
                <Flex>
                  <p>Update file content of library {libraryId}</p>
                </Flex>
                <Flex>
                  <DropzoneArea filesLimit={1} onChange={handleFileSelected} />
                </Flex>
                <HR marginBottom={16} marginTop={16} />
                <Flex>
                  <Container size="full">
                    <Flex flexFlow="column" gap={8}>
                      <Flex>Update Read permission</Flex>
                      <Flex>
                        <Select
                          selectedOption={{
                            value: selectedRead,
                            label: selectedRead,
                          }}
                          label="Select"
                          handleChange={(opt) => {
                            handleSelectChange(opt.value);
                          }}
                          options={readPermissions.map((read) => {
                            return {
                              value: read,
                              label: read,
                            };
                          })}
                        />
                      </Flex>
                    </Flex>
                  </Container>
                </Flex>
                <HR marginBottom={16} marginTop={16} />

                <Flex>
                  <Button onClick={handleClose}>Back</Button>
                  <Button onClick={handleSubmit} btnType="filled">
                    Submit
                  </Button>
                </Flex>
              </Flex>
            </>
          )}
        </Container>
      </Modal>
    </>
  );
};
