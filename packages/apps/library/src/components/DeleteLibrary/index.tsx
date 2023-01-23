import React, { useState, useEffect, useContext } from 'react';
import { useSnackbar } from 'notistack';
import { AuthContext, useRoute } from '@dapp/features-authentication';
// mint.js
import { OrigynClient, deleteLibraryAsset, getNftCollectionMeta, getNft } from '@origyn-sa/mintjs';
import { Button, Modal, Flex, Container, HR } from '@origyn-sa/origyn-art-ui';
import { LinearProgress } from '@mui/material';

export const DeleteLibrary = (props: any) => {
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
    const { canisterId } = await useRoute();

    await OrigynClient.getInstance().init(true, canisterId, { actor });
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
          return r.ok.metadata.Class.filter((x: any) => x.name === 'library')[0].value.Array.thawed;
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
    const { canisterId } = await useRoute();

    await OrigynClient.getInstance().init(true, canisterId, { actor });
    setInProgress(true);
    if (props.currentTokenId == '' && tokensThatUseSelectedLibrary.length > 0) {
      
      for (let i in tokensThatUseSelectedLibrary) {
        try {
          const responseFromNftLib = await deleteLibraryAsset(
            tokensThatUseSelectedLibrary[i],
            props.libraryId,
          );
          console.log('resp', responseFromNftLib);
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
          console.log('error', e);
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
      console.log('error', e);
      handleClose();
    }

    setInProgress(false);

    if (props.currentTokenId == '') {
      //Update the library data for the collection
      getNftCollectionMeta().then((r) => {
        props.updateCollectionLevelLibraryData(
          r.ok.metadata[0].Class.filter((res) => {
            return res.name === 'library';
          })[0].value.Array.thawed,
        );
      });
      props.setLibrary3('');
      props.setOpenLibraryCollectionLevel(false);
    } else {
      //Update the library data for the token
      getNft(props.currentTokenId).then((r) => {
        props.updateTokenLibraryData(
          r.ok.metadata.Class.filter((res) => {
            return res.name === 'library';
          })[0].value.Array.thawed,
        );
      });
      props.setOpenLibrarySelectedToken(false);
      // clean library data
      props.setLibDet('');
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
                <Flex>
                  <h4>Deleting...</h4>
                </Flex>
                <HR marginTop={16} marginBottom={16} />
                <Flex>
                  <LinearProgress color="secondary" />
                </Flex>
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
