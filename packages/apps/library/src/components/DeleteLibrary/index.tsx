import React, { useState, useEffect, useContext } from 'react';
import { useSnackbar } from 'notistack';
import { AuthContext } from '@dapp/features-authentication';
import { PerpetualOSContext } from '@dapp/features-context-provider';
import { OrigynClient, deleteLibraryAsset, getNftCollectionMeta, getNft } from '@origyn/mintjs';
import { Button, Modal, Flex, Container, HR } from '@origyn/origyn-art-ui';
import { LoadingContainer } from '@dapp/features-components';

export const DeleteLibrary = (props: any) => {
  const context = useContext(PerpetualOSContext);
  const { actor } = useContext(AuthContext);
  // Snackbar
  const { enqueueSnackbar } = useSnackbar();
  // Dialog
  const [open, setOpen] = React.useState(false);
  const [numberLibraries, setNumberLibraries] = useState(null);
  const [messageLoadingStatus, setMessageLoadingStatus] = useState(null);
  const [inProgress, setInProgress] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // Token that use the selected collection level library
  const [tokensThatUseSelectedLibrary, setTokensThatUseSelectedLibrary] = useState<string[]>([]);

  const CheckLibraries = async () => {
    await OrigynClient.getInstance().init(!context.isLocal, context.canisterId, { actor });
    setMessageLoadingStatus(false);

    if (props.currentTokenId == '') {
      let i, j: any;
      let count: number = 0;
      let arrayForTokens: string[] = [];

      let TokenArray: string[] = await getNftCollectionMeta().then((r) => {
        return r.ok.token_ids[0];
      });

      for (i in TokenArray) {
        const TokenLibraries = await getNft(TokenArray[i]).then((r) => {
          if ('Class' in r.ok.metadata)
            return r.ok.metadata.Class.filter((x: any) => x.name === 'library')[0].value['Array'];
        });
        for (j in TokenLibraries) {
          const LibraryId = TokenLibraries[j].Class.filter((item) => item.name === 'library_id')[0]
            .value.Text;
          if (LibraryId === props.libraryId) {
            count++;
            arrayForTokens.push(TokenArray[i]);
          }
        }
        setNumberLibraries(count);
        setMessageLoadingStatus(true);
        setTokensThatUseSelectedLibrary(arrayForTokens);
      }
    } else {
      setMessageLoadingStatus(true);
    }
  };

  useEffect(() => {
    CheckLibraries();
  }, [props.libraryId]);

  const DeleteMutableLibrary = async () => {
    await OrigynClient.getInstance().init(!context.isLocal, context.canisterId, { actor });
    setInProgress(true);
    if (props.currentTokenId == '' && tokensThatUseSelectedLibrary.length > 0) {
      for (let i in tokensThatUseSelectedLibrary) {
        try {
          const responseFromNftLib = await deleteLibraryAsset(
            tokensThatUseSelectedLibrary[i],
            props.libraryId,
          );

          if (responseFromNftLib.ok) {
            // Display a success message - SNACKBAR
            enqueueSnackbar('Library Deleted from ' + tokensThatUseSelectedLibrary[i], {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
            });
            handleClose();
          }
        } catch (e) {
          enqueueSnackbar('Something went wrong', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });

          handleClose();
        }
      }
    }

    try {
      const response = await deleteLibraryAsset(props.currentTokenId, props.libraryId);
      if (response.ok) {
        // Display a success message - SNACKBAR
        enqueueSnackbar('Library Deleted', {
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

    if (props.currentTokenId == '') {
      //Update the library data for the collection
      getNftCollectionMeta().then((r) => {
        props.updateCollectionLevelLibraryData(
          r.ok.metadata[0]['Class'].filter((res) => {
            return res.name === 'library';
          })[0].value.Array,
        );
      });
      props.setCollectionLevelLibraryMetadata('');
      props.setOpenLibraryCollectionLevel(false);
    } else {
      //Update the library data for the token
      getNft(props.currentTokenId).then((r) => {
        if ('Class' in r.ok.metadata) {
          props.updateTokenLibraryData(
            r.ok.metadata.Class.filter((res) => {
              return res.name === 'library';
            })[0].value['Array'],
          );
        }
      });
      props.setOpenLibrarySelectedToken(false);
      // clean library data
      props.setTokenLevelLibraryMetadata('');
    }
  };

  return (
    <>
      <Button onClick={handleClickOpen} btnType="filled">
        Delete this Library
      </Button>
      <Modal closeModal={handleClose} isOpened={open} mode="light" size="md">
        <Container padding="16px">
          <Flex flexFlow="column" gap={16}>
            {inProgress ? (
              <>
                <h4>Delete library in progress</h4>
                <LoadingContainer margin="24px" />
              </>
            ) : (
              <>
                <Flex>
                  <h4>Delete Library: {props.libraryId}</h4>
                </Flex>
                <HR marginTop={16} marginBottom={16} />
                {props.currentTokenId == '' ? (
                  <Flex>
                    <>
                      {messageLoadingStatus ? (
                        <>
                          {numberLibraries > 0 ? (
                            <>
                              There are {numberLibraries} NFTs that use this library. <br />
                              Are you sure you want to delete it? <br />
                            </>
                          ) : (
                            <>
                              There are no NFTs that use this library. <br />
                              Are you sure you want to delete it? <br />
                            </>
                          )}
                          <b>This action is irreversible.</b>
                        </>
                      ) : (
                        <>
                          <h4>Loading...</h4>
                        </>
                      )}
                    </>
                  </Flex>
                ) : (
                  <Flex>
                    <p>
                      Are you sure you want to delete this library? <br />
                      <b>This action is irreversible.</b>
                    </p>
                  </Flex>
                )}
                <HR marginTop={16} marginBottom={16} />
                <Flex>
                  <Button onClick={handleClose}>Back</Button>
                  <>
                    {messageLoadingStatus ? (
                      <>
                        <Button btnType="filled" onClick={DeleteMutableLibrary}>
                          Delete
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={DeleteMutableLibrary} btnType="filled">
                          Delete
                        </Button>
                      </>
                    )}
                  </>
                </Flex>
              </>
            )}
          </Flex>
        </Container>
      </Modal>
    </>
  );
};
