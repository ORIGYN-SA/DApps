import React, { useState, useContext, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { AuthContext } from '@dapp/features-authentication';
import { PerpetualOSContext } from '@dapp/features-context-provider';
import {
  OrigynClient,
  updateLibraryMetadata,
  getNftCollectionMeta,
  getNft,
  setLibraryImmutable,
} from '@origyn/mintjs';
import {
  Button,
  Modal,
  Container,
  Flex,
  HR,
  TextInput,
  Select,
  CheckboxInput,
} from '@origyn/origyn-art-ui';
import { LoadingContainer } from '@dapp/features-components';
type Props = {
  tokenId: string;
  updateLibraryData: any;
  setOpenLibrary: any;
  metadata: any;
};
export const UpdateLibraryWeb = ({
  tokenId,
  updateLibraryData,
  setOpenLibrary,
  metadata,
}: Props) => {
  const context = useContext(PerpetualOSContext);
  const { actor } = useContext(AuthContext);

  const title = metadata.Class?.filter((res) => res.name === 'title')[0].value.Text;
  const url = metadata.Class?.filter((res) => res.name === 'location')[0].value.Text;
  const libraryId = metadata.Class?.filter((res) => res.name === 'library_id')[0].value.Text;
  const read = metadata.Class?.filter((res) => res.name === 'read')[0].value.Text;

  const readPermissions = ['public', 'owner'];

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [typedTitle, setTypedTitle] = useState<string>(title);
  const [typedUrl, setTypedUrl] = useState<string>(url);
  const [selectedRead, setSelectedRead] = useState<string>(read);
  const [immutable, setImmutable] = useState<boolean>(false);

  useEffect(() => {
    setTypedTitle(title);
    setTypedUrl(url);
    setSelectedRead(read);
  }, [metadata]);

  const handleChangeImmutable = () => {
    setImmutable(!immutable);
  };
  const getTypedTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedTitle(event.target.value);
  };
  const getTypedUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedUrl(event.target.value);
  };
  const handleSelectChange = (val) => {
    setSelectedRead(val);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setInProgress(true);

    try {
      let successMsg = 'Web Library Updated';

      await OrigynClient.getInstance().init(!context.isLocal, context.canisterId, { actor });

      const updateResponse = await updateLibraryMetadata(tokenId, libraryId, {
        title: typedTitle,
        location: typedUrl,
        read: selectedRead,
      });

      if ('ok' in updateResponse) {
        if (immutable) {
          setLibraryImmutable(tokenId, libraryId);
          successMsg = 'Library Updated and made immutable';
        }
        // Display a success message - SNACKBAR
        enqueueSnackbar(successMsg, {
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
    if (tokenId == '') {
      //Update the library data for the collection
      getNftCollectionMeta().then((r) => {
        updateLibraryData(
          r.ok.metadata[0]['Class'].filter((res) => {
            return res.name === 'library';
          })[0].value.Array,
        );
      });
      setOpenLibrary(false);
    } else {
      //Update the library data for the Token
      getNft(tokenId).then((r) => {
        if ('Class' in r.ok.metadata) {
          updateLibraryData(
            r.ok.metadata.Class.filter((res) => {
              return res.name === 'library';
            })[0].value['Array'],
          );
        }
      });
      setOpenLibrary(false);
    }
  };

  return (
    <>
      <Button onClick={handleClickOpen} btnType="filled">
        Update library file
      </Button>

      <Modal closeModal={handleClose} isOpened={open} mode="light" size="md">
        <Container padding="16px" size="full">
          {inProgress ? (
            <>
              <h4>Update in Progress</h4>
              <LoadingContainer margin="24px" />
            </>
          ) : (
            <>
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
                      <Flex>Update library URL</Flex>
                      <Flex>
                        <TextInput
                          label="Library URL"
                          id="url"
                          placeholder="Enter Library URL"
                          onChange={getTypedUrl}
                          value={typedUrl}
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
