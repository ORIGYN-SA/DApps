import React, { useState, useEffect, useContext } from 'react';
import { DropzoneArea } from 'mui-file-dropzone';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import { AuthContext, useRoute } from '@dapp/features-authentication';
// mint.js
import { OrigynClient, updateLibraryFileContent } from '@origyn-sa/mintjs';
// Button delete
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
// Dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import { Button } from '@origyn-sa/origyn-art-ui';

type Props = {
  tokenId: string;
  libraryId: string;
};
export const UpdateLibraryFile = ({ tokenId, libraryId }: Props) => {
  const { actor } = useContext(AuthContext);
  // Snackbar
  const { enqueueSnackbar } = useSnackbar();
  // Dialog
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

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
    await OrigynClient.getInstance().init(true, canisterId, { actor });
    const updateResponse = await updateLibraryFileContent(tokenId, libraryId, file);
    console.log('🚀 ~ file: index.tsx:56 ~ handleSubmit ~ updateResponse', updateResponse);
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
      </Dialog>
    </>
  );
};
