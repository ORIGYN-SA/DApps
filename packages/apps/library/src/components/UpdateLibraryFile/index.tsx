import React, { useState, useEffect, useContext } from 'react';
import { DropzoneArea } from 'mui-file-dropzone';
import { useSnackbar } from 'notistack';
import { AuthContext, useRoute } from '@dapp/features-authentication';
// mint.js
import { OrigynClient, updateLibraryFileContent, getNftCollectionMeta } from '@origyn-sa/mintjs';
// Dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@origyn-sa/origyn-art-ui';
import { LinearProgress } from '@mui/material';

type Props = {
  tokenId: string;
  libraryId: string;
  updateCollectionLevelLibraryData: any;
};
export const UpdateLibraryFile = ({
  tokenId,
  libraryId,
  updateCollectionLevelLibraryData,
}: Props) => {
  const { actor } = useContext(AuthContext);
  // Snackbar
  const { enqueueSnackbar } = useSnackbar();
  // Dialog
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [inProgress, setInProgress] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleFileSelected = (files) => {
    setSelectedFile(files[0]);
  };

  const handleSubmit = async () => {
    console.log('i am here');
    console.log(tokenId, libraryId);
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
    const { canisterId } = await useRoute();
    setInProgress(true);
    try {
      await OrigynClient.getInstance().init(true, canisterId, { actor });
      const updateResponse = await updateLibraryFileContent(tokenId, libraryId, file);
      console.log('updateResponse', updateResponse);
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

    //Update the library data for the collection
    getNftCollectionMeta().then((r) => {
      updateCollectionLevelLibraryData(
        r.ok.metadata[0].Class.filter((res) => {
          return res.name === 'library';
        })[0].value.Array.thawed,
      );
    });
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

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {inProgress ? (
          <>
            <DialogTitle>Updating in Progress</DialogTitle>
            <DialogContent>
              <LinearProgress color="secondary" />
            </DialogContent>
          </>
        ) : (
          <>
            <DialogTitle id="alert-dialog-title">
              Update file content of library
              {libraryId}
            </DialogTitle>
            <DialogContent>
              <DropzoneArea filesLimit={1} onChange={handleFileSelected} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Back</Button>
              <Button onClick={handleSubmit} btnType="filled">
                Submit
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};
