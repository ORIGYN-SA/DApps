import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { getCanisterId } from '@dapp/features-authentication';
import { useSnackbar } from 'notistack';
// mint.js
import { OrigynClient, deleteLibraryAsset, getNft } from '@origyn-sa/mintjs';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { Typography } from '@mui/material';

const TEST_IDENTITY = {
  principalId: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
  seed: 'inherit disease hill can squirrel zone science dentist sadness exist wear aim',
};

export const DeleteLibrary = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();

  const [libraries, setLibraries] = React.useState<any>([]);
  const [selectedLibrary, setSelectedLibrary] = React.useState('');

  const getLibraries = async () => {
    await OrigynClient.getInstance().init(true, await getCanisterId());
    const response = await getNft(props.currentTokenId);
    console.log('responseCollection', response);
    let libraries = [];
    try{
    let LibArrayFromMeta = response.ok.metadata.Class.filter((res) => {
        return res.name === 'library';
    })[0].value.Array.thawed;
    console.log('LibArrayFromMeta', LibArrayFromMeta);
    let i: any;
    for(i in LibArrayFromMeta){
        libraries.push(
        LibArrayFromMeta[i].Class.filter((res) => {
            return res.name === 'library_id';
        })[0].value.Text,
        );
    }
    console.log('libraries', libraries);
    } catch (e) {
        console.log('error', e);
    }

    setLibraries(libraries);
    setSelectedLibrary(libraries[0]);
  };

  const StageCollectionLibrary = async () => {
    await OrigynClient.getInstance().init(true, await getCanisterId(), {
      key: {
        seed: TEST_IDENTITY.seed,
      },
    });
    try {
      const response = await deleteLibraryAsset(props.currentTokenId, selectedLibrary);
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
      } else {
        enqueueSnackbar('Something went wrong', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      }
    } catch (e) {
      console.log('error', e);
    }
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedLibrary(event.target.value as string);
  };

  useEffect(() => {
    getLibraries();
  }, [props.currentTokenId]);

  return (
    <Grid item xs={12} m={2}>
      <Box
        sx={{
          textAlign: 'Left',
          mt: 2,
          mb: 2,
        }}
      >
        <Typography gutterBottom component="div">
           <b>Token ID: {props.currentTokenId}</b>
        </Typography>
        <Typography>
            Select a Library to delete
        </Typography>
      </Box>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedLibrary}
          label="Select"
          onChange={handleSelectChange}
        >
          {libraries.map((library, index) => {
            return (
              <MenuItem key={library + index} value={library}>
                {library}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Box
        sx={{
          textAlign: 'right',
          mt: 2,
        }}
      >
        <Button variant="outlined" onClick={() => StageCollectionLibrary()}>
          DELETE LIB
        </Button>
      </Box>
    </Grid>
  );
};
