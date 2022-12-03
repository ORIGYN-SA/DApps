import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { getCanisterId } from '@dapp/features-authentication';
import { useSnackbar } from 'notistack';
// mint.js
import { OrigynClient, stageWebLibraryAsset, getNftCollectionMeta } from '@origyn-sa/mintjs';
import FormControl from '@mui/material/FormControl';

const TEST_IDENTITY = {
  principalId: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
  seed: 'inherit disease hill can squirrel zone science dentist sadness exist wear aim',
};

export const WebLocation = (props: any) => {

  const { enqueueSnackbar } = useSnackbar();

  const [typedUrl, setTypedUrl] = useState('');
  const [typedTitle, setTypedTitle] = useState('');

  const getTypedTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedTitle(event.target.value);
  };

  const getTypedUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedUrl(event.target.value);
  };

  const StageWebLibrary = async () => {
    await OrigynClient.getInstance().init(true, await getCanisterId(), {
      key: {
        seed: TEST_IDENTITY.seed,
      },
    });

    try {
      const response = await stageWebLibraryAsset(props.tokenId, typedTitle, typedUrl);
      if (response.ok) {
        // Display a success message - SNACKBAR
        enqueueSnackbar('Library staged!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      } else {
        enqueueSnackbar('Library not staged!', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      }
    } catch (e) {
      console.log(e);
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
        <FormControl fullWidth>
        <TextField
          id="title"
          label="Library Title"
          variant="outlined"
          fullWidth
          placeholder="Enter Title"
          onChange={getTypedTitle}
        />
        </FormControl>
      </Box>
      <Box
        sx={{
          textAlign: 'right',
          mt: 2,
        }}
      >
        <FormControl fullWidth>
        <TextField
          id="web"
          label="Web Location"
          variant="outlined"
          fullWidth
          placeholder="https://www.example.com"
          onChange={getTypedUrl}
        />
        </FormControl>
      </Box>
      <Box
        sx={{
          textAlign: 'right',
          mt: 2,
        }}
      >
        <Button variant="outlined" onClick={() => StageWebLibrary()}>
          STAGE LIBRARY
        </Button>
      </Box>
    </Grid>
  );
};
