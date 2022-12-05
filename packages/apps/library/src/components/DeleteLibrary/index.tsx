import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { getCanisterId } from '@dapp/features-authentication';
import { useSnackbar } from 'notistack';
// mint.js
import { OrigynClient, deleteLibraryAsset } from '@origyn-sa/mintjs';
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

const TEST_IDENTITY = {
  principalId: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
  seed: 'inherit disease hill can squirrel zone science dentist sadness exist wear aim',
};

export const DeleteLibrary = (props: any) => {
  // Snackbar
  const { enqueueSnackbar } = useSnackbar();
  // Dialog
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const DeleteMutableLibrary = async () => {
    await OrigynClient.getInstance().init(true, await getCanisterId(), {
      key: {
        seed: TEST_IDENTITY.seed,
      },
    });
    try {
      const response = await deleteLibraryAsset(props.currentTokenId, props.libraryId);
      console.log('resp', response);
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
          textAlign: 'right',
          mt: 2,
        }}
      >
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
              <DialogTitle id="alert-dialog-title">{"Delete library "}{props.libraryId}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this library? <br/><b>This action is irreversible.</b>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Back</Button>
                <Button onClick={DeleteMutableLibrary} autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <></>
        )}
      </Box>
    </Grid>
  );
};
