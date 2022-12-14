import React, { useState, useEffect,useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { AuthContext, useRoute } from '@dapp/features-authentication'
import { useSnackbar } from 'notistack';
// mint.js
import { OrigynClient, stageCollectionLibraryAsset, getNftCollectionMeta } from '@origyn-sa/mintjs';
import type { StageFile } from '@origyn-sa/mintjs/lib/methods/nft/types';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export const CollectionLocation = (props: any) => {
  const {actor} = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [libraries, setLibraries] = React.useState<any>([]);
  const [selectedLibrary, setSelectedLibrary] = React.useState('');
  const [typedTitle, setTypedTitle] = useState('');

  const [immutable, setImmutable] = React.useState(false);
  const handleChange = (event) => {
    setImmutable(event.target.value);
    console.log(event.target.value)
  };

  const getTypedTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedTitle(event.target.value);
  };

  const getLibraries = async () => {
    const {canisterId} = await useRoute();
    await OrigynClient.getInstance().init(true, canisterId);
    const response = await getNftCollectionMeta();
    const library = await response.ok.metadata[0].Class.filter((res) => {
      return res.name === 'library';
    })[0].value.Array.thawed;
    console.log('responseCollection', library);
    let libraries = [];
    let i: any;
    for (i in library) {
      libraries.push(
        library[i].Class.filter((res) => {
          return res.name === 'library_id';
        })[0].value.Text,
      );
    }
    setLibraries(libraries);
    setSelectedLibrary(libraries[0]);
  };

  const StageCollectionLibrary = async () => {
    const {canisterId} = await useRoute();
    await OrigynClient.getInstance().init(true, canisterId, {actor});
    try {
      const CollectionFile: StageFile = {
        filename: typedTitle,
        title: typedTitle,
        path: '',
        libraryId: selectedLibrary,
      };
      const response = await stageCollectionLibraryAsset(props.tokenId, CollectionFile);
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
      console.log('error', e);
    }
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedLibrary(event.target.value as string);
  };

  useEffect(() => {
    getLibraries();
  }, []);

  return (
    <Grid item xs={12} m={2}>
      <Box
        sx={{
          textAlign: 'right',
          mt: 2,
          mb: 2,
        }}
      >
        <TextField
          id="title"
          label="Library Title"
          variant="outlined"
          fullWidth
          placeholder="Enter Title"
          onChange={getTypedTitle}
        />
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
          STAGE LIBRARY
        </Button>
      </Box>
    </Grid>
  );
};
