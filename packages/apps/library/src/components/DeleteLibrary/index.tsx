import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { getCanisterId } from '@dapp/features-authentication';
import { useSnackbar } from 'notistack';
import { AuthContext } from '@dapp/features-authentication';
// mint.js
import { OrigynClient, deleteLibraryAsset, getNftCollectionMeta, getNft } from '@origyn-sa/mintjs';
// Button delete
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
// Dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

export const DeleteLibrary = (props: any) => {
  const { actor } = useContext(AuthContext);
  // Snackbar
  const { enqueueSnackbar } = useSnackbar();
  // Dialog
  const [open, setOpen] = React.useState(false);
  const [numberLibraries, setNumberLibraries] = useState(null);
  const [messageLoadingStatus, setMessageLoadingStatus] = useState(null);
  const handleClickOpen = () => {setOpen(true);};
  const handleClose = () => {setOpen(false)};
  // Token that use the selected collection level library
  const [tokensThatUseSelectedLibrary, setTokensThatUseSelectedLibrary] = useState<string[]>([]);


  const CheckLibraries = async () => {
    
    await OrigynClient.getInstance().init(true, await getCanisterId(),{actor});
    setMessageLoadingStatus(false);

    if (props.currentTokenId == '') {

      let i,j: any;
      let count: number = 0;
      let arrayForTokens : string[] = [];

      let TokenArray : string[] = await getNftCollectionMeta().then((r) => {
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

    await OrigynClient.getInstance().init(true, await getCanisterId(),{actor});

    if (props.currentTokenId == '' && tokensThatUseSelectedLibrary.length > 0) {
      for (let i in tokensThatUseSelectedLibrary) {
        try {
          const responseFromNftLib =  await deleteLibraryAsset(tokensThatUseSelectedLibrary[i], props.libraryId);
          console.log('resp', responseFromNftLib);
          if (responseFromNftLib.ok) {
            // Display a success message - SNACKBAR
            enqueueSnackbar('Library Deleted from '+tokensThatUseSelectedLibrary[i] , {
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
  };

  return (
    <Grid item xs={12} m={2}>
      <Box
        sx={{
          mt: 2,
        }}
      >
        <>
          {props.loggedIn && props.owner ? (
            <>
              {!props.isMutable ? (
                <>
                  <Stack direction="row" spacing={2}>
                    <Button
                      onClick={handleClickOpen}
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                    >
                      Delete this Library
                    </Button>
                  </Stack>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {'Delete library: '}
                      {props.libraryId}
                    </DialogTitle>
                    {props.currentTokenId == '' ? (
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
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
                              <Typography variant="body1" color="textSecondary">
                                Loading...
                              </Typography>
                            </>
                          )}
                        </DialogContentText>
                      </DialogContent>
                    ) : (
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Are you sure you want to delete this library? <br />
                          <b>This action is irreversible.</b>
                        </DialogContentText>
                      </DialogContent>
                    )}
                    <DialogActions>
                      <Button onClick={handleClose}>Back</Button>
                      <>
                      {
                       messageLoadingStatus ? (
                        <>
                         <Button onClick={DeleteMutableLibrary} color="warning" autoFocus>
                        Delete
                      </Button>
                        </>
                       ) : (
                        <>
                         <Button onClick={DeleteMutableLibrary} color="warning" autoFocus disabled={true}>
                        Delete
                      </Button>
                        </>
                       )
                      }
                      </>
                     
                    </DialogActions>
                  </Dialog>
                </>
              ) : (
                <>
                <Typography fontSize={10}>This library is immutable and can not be deleted</Typography>
                </>
              )}
            </>
          ) : (
            <>
              <Typography fontSize={10}>Not Logged In</Typography>
            </>
          )}
        </>
      </Box>
    </Grid>
  );
};
