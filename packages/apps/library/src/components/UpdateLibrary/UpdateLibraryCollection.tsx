import React, { useState, useContext, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { AuthContext, useRoute } from '@dapp/features-authentication';
// mint.js
import {
  OrigynClient,
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
export const UpdateLibraryCollection = ({
  tokenId,
  updateLibraryData,
  setOpenLibrary,
  metadata,
}: Props) => {
  const { actor } = useContext(AuthContext);

  const title = metadata.Class?.filter((res) => res.name === 'title')[0].value.Text;
  const libraryId = metadata.Class?.filter((res) => res.name === 'library_id')[0].value.Text;
  const read = metadata.Class?.filter((res) => res.name === 'read')[0].value.Text;

  const readPermissions = ['public', 'owner', 'collection_owner'];

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [typedTitle, setTypedTitle] = useState<string>(title);
  const [selectedRead, setSelectedRead] = useState<string>(read);

  const getLibraries = async () => {
    const { canisterId } = await useRoute();
    await OrigynClient.getInstance().init(true, canisterId, { actor });
    const response = await getNftCollectionMeta();
    const library = await response.ok.metadata[0].Class.filter((res) => {
      return res.name === 'library';
    })[0].value.Array.thawed;
    console.log('responseCollection', library);
    let libraries = [];
    let i: any;
    for (i in library) {
      libraries.push(
        library[i].Class.filter((res) => {
          return res.name === 'library_id';
        })[0].value.Text,
      );
    }
  };

  useEffect(() => {
    setTypedTitle(title);
    setSelectedRead(read);
    getLibraries();
  }, [metadata]);

  const getTypedTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedTitle(event.target.value);
  };
  const handleSelectChange = (val) => {
    setSelectedRead(val);
  };
  // const handleSelectChangeLibrary = (val) => {
  //   setSelectedRead(val);
  // };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  console.log('meta', metadata);
  const handleSubmit = async () => {
    const { canisterId } = await useRoute();
    setInProgress(true);

    try {
      await OrigynClient.getInstance().init(true, canisterId, { actor });
      const updateResponse = await updateLibraryMetadata(tokenId, libraryId, {
        title: typedTitle,
        read: selectedRead,
      });
      console.log(updateResponse);
      if (updateResponse.ok) {
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
    //Update the library data for the Token
    getNft(tokenId).then((r) => {
      updateLibraryData(
        r.ok.metadata.Class.filter((res) => {
          return res.name === 'library';
        })[0].value.Array.thawed,
      );
    });
    setOpenLibrary(false);
  };

  return (
    <>
      <Button onClick={handleClickOpen} btnType="filled">
        Update library file
      </Button>

      <Modal closeModal={handleClose} isOpened={open} mode="light" size="md">
        {inProgress ? (
          <Container padding="16px" size="full">
            <LinearProgress color="secondary" />
          </Container>
        ) : (
          <>
            <Container padding="16px" size={'full'}>
              <Flex flexFlow="column" gap={16}>
                <Flex>
                  <h4>Update library file</h4>
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
            </Container>
          </>
        )}
      </Modal>
    </>
  );
};
