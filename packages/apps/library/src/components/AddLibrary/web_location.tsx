import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { getCanisterId, AuthContext } from '@dapp/features-authentication';
import { useSnackbar } from 'notistack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
// mint.js
import { OrigynClient, stageWebLibraryAsset } from '@origyn-sa/mintjs';

export const WebLocation = (props: any) => {

  const { actor } = useContext(AuthContext);

  const { enqueueSnackbar } = useSnackbar();

  const [typedUrl, setTypedUrl] = useState('');
  const [typedTitle, setTypedTitle] = useState('');

  const [immutable, setImmutable] = React.useState(false);
  const handleChange = (event) => {
    setImmutable(event.target.value);
    console.log(event.target.value)
  };


  const getTypedTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedTitle(event.target.value);
  };

  const getTypedUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedUrl(event.target.value);
  };

  const StageWebLibrary = async () => {
    await OrigynClient.getInstance().init(true, await getCanisterId(), {actor});

    try {
      const response = await stageWebLibraryAsset(props.tokenId, typedTitle, typedUrl,immutable);
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
            mt: 2,
          }}
        >
          <Grid item xs={12} m={2}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Make library mutable or not</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="Mutable"
                name="radio-buttons-group"
                value={immutable}
                onChange={handleChange}
              >
                <FormControlLabel value={false}control={<Radio />} label="Mutable" />
                <FormControlLabel value={true} control={<Radio />} label="Immutable" />
              </RadioGroup>
            </FormControl>
          </Grid>
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
