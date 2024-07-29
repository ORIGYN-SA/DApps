import React, { useState, useContext, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { AuthContext } from '@dapp/features-authentication';
import { PerpetualOSContext } from '@dapp/features-context-provider';
// mint.js
import { OrigynClient, updateLibraryMetadata, getNftCollectionMeta, getNft } from '@origyn/mintjs';
import { Button, Modal, Container, Flex, HR, TextInput, Select } from '@origyn/origyn-art-ui';
import { LoadingContainer } from '@dapp/features-components';
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
  const context = useContext(PerpetualOSContext);
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
    await OrigynClient.getInstance().init(!context.isLocal, context.canisterId, { actor });
    const response = await getNftCollectionMeta();
    const library = await (response.ok?.metadata[0]?.['Class'] ?? []).filter((res) => {
      return res.name === 'library';
    })[0].value.Array;
    let libraries: string[] = [];
    let i: any;
    for (i in library) {
      libraries.push(
        (
          library[i].Class.filter((res: any) => {
            return res.name === 'library_id';
          })[0].value as { Text: string }
        ).Text,
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

  const handleSubmit = async () => {
    setInProgress(true);

    try {
      await OrigynClient.getInstance().init(!context.isLocal, context.canisterId, { actor });
      const updateResponse = await updateLibraryMetadata(tokenId, libraryId, {
        title: typedTitle,
        read: selectedRead,
      });

      if (updateResponse && 'ok' in updateResponse) {
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
      console.error('error', e);
      handleClose();
    }
    setInProgress(false);
    //Update the library data for the Token
    getNft(tokenId).then((r) => {
      if (r.ok && 'metadata' in r.ok) {
        updateLibraryData(
          (r.ok.metadata as any).Class.filter((res) => {
            return res.name === 'library';
          })[0].value['Array'],
        );
      }
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
            <LoadingContainer margin="24px" />
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
