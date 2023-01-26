import React, { useState, useContext, useEffect } from 'react';
import { DropzoneArea } from 'mui-file-dropzone';
import { useSnackbar } from 'notistack';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { Buffer } from 'buffer';

// mint.js
import {
  OrigynClient,
  updateLibraryFileContent,
  updateLibraryMetadata,
  getNftCollectionMeta,
  getNft,
  setLibraryImmutable,
} from '@origyn-sa/mintjs';
import { StageFile } from '@origyn-sa/mintjs/lib/methods/nft/types';
import {
  Button,
  Modal,
  Container,
  Flex,
  HR,
  TextInput,
  Select,
  CheckboxInput,
} from '@origyn-sa/origyn-art-ui';
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
  console.log(metadata);

  const { actor } = useContext(AuthContext);
  // Snackbar
  const { enqueueSnackbar } = useSnackbar();
  // Dialog
  const [open, setOpen] = useState(false);

  const title = metadata.Class?.filter((res) => res.name === 'title')[0].value.Text;
  const read = metadata.Class?.filter((res) => res.name === 'read')[0].value.Text;
  const libraryId = metadata.Class?.filter((res) => res.name === 'library_id')[0].value.Text;
  const readPermissions = ['public', 'owner'];

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [inProgress, setInProgress] = useState(false);
  const [typedTitle, setTypedTitle] = useState<string>(title);
  const [selectedRead, setSelectedRead] = useState<string>(read);
  const [immutable, setImmutable] = useState<boolean>(false);

  useEffect(() => {
    setTypedTitle(title);
    setSelectedRead(read);
  }, [metadata]);

  const handleChangeImmutable = () => {
    setImmutable(!immutable);
  };

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

  const showSnackbar = (message: string, isSuccess: boolean) => {
    enqueueSnackbar(message, {
      variant: isSuccess ? 'success' : 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
  };

  const uploadFileRecursive = async (
    tokenId: string,
    libraryId: string,
    fileInfo: StageFile,
    retryCount: number = 1,
  ): Promise<boolean> => {
    console.log('waiting for updateLibraryFileContent call to complete...');
    const start = Date.now();
    const result = await updateLibraryFileContent(tokenId, libraryId, fileInfo);
    const finish = Date.now();

    console.log(`updateLibraryFileContent call completed in ${(finish - start) / 1000} seconds`);

    if (result.err) {
      console.log(result.err);
      if (retryCount <= 5) {
        showSnackbar(`Upload failed. Retry # ${retryCount}.`, false);
        retryCount++;
        return uploadFileRecursive(tokenId, libraryId, fileInfo, retryCount);
      } else {
        showSnackbar(`Upload failed after ${retryCount - 1} retries.`, false);
        return false;
      }
    }
    return true;
  };

  const updateMetadataRecursive = async (
    tokenId: string,
    libraryId: string,
    data: Record<string, string | number | boolean>,
    retryCount: number = 1,
  ): Promise<boolean> => {
    console.log('waiting for updateLibraryMetadata call to complete...');
    const start = Date.now();
    const result = await updateLibraryMetadata(tokenId, libraryId, data);
    const finish = Date.now();

    console.log(`updateLibraryMetadata call completed in ${(finish - start) / 1000} seconds`);

    if (result.err) {
      console.log(result.err);
      if (retryCount <= 5) {
        showSnackbar(`Update failed. Retry # ${retryCount}.`, false);
        retryCount++;
        return updateMetadataRecursive(tokenId, libraryId, data, retryCount);
      } else {
        showSnackbar(`Update failed after ${retryCount - 1} retries.`, false);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    const { canisterId } = await useRoute();
    let fileInfo: StageFile;
    if (selectedFile) {
      const rawFile = await readFileAsync(selectedFile);
      fileInfo = {
        filename: selectedFile.name,
        index: 0,
        path: `${selectedFile.size}+${selectedFile.name}`,
        size: selectedFile.size,
        type: selectedFile.type,
        rawFile: rawFile,
      };
    }

    setInProgress(true);

    try {
      await OrigynClient.getInstance().init(true, canisterId, { actor });

      // TODO: Implement a more transactional approach to ensure that file uploads
      // and metadata stay in sync if either operation fails.
      // This may require enhancements to origyn_nft canister or mintjs.

      // Update library file with retries
      const uploadSucceeded = await uploadFileRecursive(tokenId, libraryId, fileInfo);
      if (!uploadSucceeded) {
        return;
      }

      // Update library metadata with retries
      const updateSucceeded = await updateMetadataRecursive(tokenId, libraryId, {
        title: typedTitle,
        read: selectedRead,
      });
      if (!updateSucceeded) {
        showSnackbar('Something went wrong', false);
        return;
      }

      let successMsg = 'Library Updated';
      if (immutable) {
        setLibraryImmutable(tokenId, libraryId);
        successMsg += ' and made immutable';
      }
      showSnackbar(successMsg, true);

      if (updateLibraryData) {
        if (tokenId == '') {
          // Update the library data for the collection
          const collMeta = await getNftCollectionMeta();
          if (collMeta.ok) {
            const collLibrary = collMeta.ok.metadata[0].Class.filter(
              (res) => res.name === 'library',
            )[0].value.Array.thawed;
            updateLibraryData(collLibrary);
          }
        } else {
          // Update the library data for the Token
          const nftMeta = await getNft(tokenId);
          if (nftMeta.ok) {
            const nftLibrary = nftMeta.ok.metadata.Class.filter((res) => res.name === 'library')[0]
              .value.Array.thawed;
            updateLibraryData(nftLibrary);
          }
        }
      }
    } catch (e) {
      console.log(e);
      showSnackbar('Something went wrong', false);
    } finally {
      setInProgress(false);
      handleClose();
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
              <h4>Update in Progress</h4>
              <br />
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
                  <DropzoneArea
                    filesLimit={1}
                    onChange={handleFileSelected}
                    maxFileSize={2147483648}
                  />
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
                  <Flex flexFlow="row" gap={8}>
                    <Flex>
                      <CheckboxInput
                        name="immutable"
                        onChange={handleChangeImmutable}
                        checked={immutable}
                      />
                    </Flex>
                    <Flex>
                      <p>
                        Make this Library <b>immutable</b>
                      </p>
                    </Flex>
                  </Flex>
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
