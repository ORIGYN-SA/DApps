import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { getCanisterId } from '@dapp/features-authentication';
import { useSnackbar } from 'notistack';
import { AuthContext } from '@dapp/features-authentication';
// mint.js
import { OrigynClient,stageCollectionLibraryAsset, stageWebLibraryAsset, stageLibraryAsset } from '@origyn-sa/mintjs';
import { StageFile } from '@origyn-sa/mintjs/lib/methods/nft/types';
import { GetFormattedLink } from '@dapp/utils';
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
import { ContactSupportOutlined } from '@mui/icons-material';

export const EditLibrary = (props:any) => {
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

  // Functions needed for file to Buffer
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

  const UpdateLibrary = async () => {

    await OrigynClient.getInstance().init(true, await getCanisterId(),{actor});

    switch(props.locationType){
      case 'collection':
        const CollectionFile: StageFile = {
          filename: props.libraryTitle,
          title: props.libraryTitle,
          path: '',
          libraryId: props.libraryId,
        };
        try {
          const response = await stageCollectionLibraryAsset(props.currentTokenId,CollectionFile)
          console.log(response);
          if (response.ok) {
            // Display a success message - SNACKBAR
            enqueueSnackbar('Library Updated!', {
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
      break;
      case 'web':
        const WebFile: StageFile = {
          filename: props.typedId,
          title: props.libraryTitle,
          path: '',
          libraryId: props.typedId,
          webUrl:props.location,
        };
        try {
          const response = await stageWebLibraryAsset(props.currentTokenId,WebFile);
          console.log(response);
          if (response.ok) {
            // Display a success message - SNACKBAR
            enqueueSnackbar('Library Updated!', {
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
          handleClose();}
      break;
      case 'canister':
        const myFileLink = GetFormattedLink(await getCanisterId(),props.location);
        
        const myRawFile = fetch(await myFileLink).then(res => res.blob()).then(blob => {
        return new File ([blob],props.libraryTitle,{type:blob.type})
        });

        const MYFILE : File = await myRawFile;
        console.log(MYFILE);
        const CanisterFile: StageFile[] = [{
          filename: props.libraryTitle,
          title: props.libraryTitle,
          path: '',
          libraryId: props.typedId,
          rawFile: await readFileAsync(MYFILE)
        }];
        try {
          const response = await stageLibraryAsset([CanisterFile[0]],props.currentTokenId);
          console.log(response);
          if (response.ok) {
            // Display a success message - SNACKBAR
            enqueueSnackbar('Library Updated!', {
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
      break;
    };
  };
  return (
    <Grid item xs={12} m={2}>
      <Box
        sx={{
          mt: 2,
        }}
      >
        <Button 
          variant="contained"
          color="success"
          onClick={UpdateLibrary}
        >Update</Button>
      </Box>
    </Grid>
  );
};
