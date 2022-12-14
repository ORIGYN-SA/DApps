import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
// mint.js
import { OrigynClient, getNftCollectionMeta } from '@origyn-sa/mintjs';
import Collapse from '@mui/material/Collapse';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
// LocationTypes
import { WebLocation } from './web_location';
import { CollectionLocation } from './collection_location';
import { CanisterLocation } from './canister_location';
import { useRoute } from '../../../../../features/authentication'

export const LibraryForm = (props: any) => {

  const [radioValue, setRadioValue] = React.useState('Canister');
  const [openFileInput, setOpenFileInput] = React.useState(false);
  const [openSelectInput, setOpenSelectInput] = React.useState(false);
  const [openWebInput, setOpenWebInput] = React.useState(false);


  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
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
  };

  useEffect(() => {
    switch (radioValue) {
      case 'Canister':
        setOpenFileInput(true);
        setOpenSelectInput(false);
        setOpenWebInput(false);
        break;
      case 'Web':
        setOpenFileInput(false);
        setOpenSelectInput(false);
        setOpenWebInput(true);
        break;
      case 'Collection':
        setOpenFileInput(false);
        setOpenSelectInput(true);
        setOpenWebInput(false);
        getLibraries();
        break;
    }
  }, [radioValue]);

  return (
    <Grid container maxHeight={300} width={'max-content'}>
      <Grid item xs={12}>
        <Typography
          sx={{
            m: 2,
            fontSize: 14,
            borderBottom: '1px solid',
          }}
          color="text.secondary"
          gutterBottom
        >
          {props.currentTokenId === '' ? (
            <>
              <b>Stage a library for the collection</b>
              <>
              <CanisterLocation tokenId={props.currentTokenId} />
              </>
            </>
          ) : (
            <>
              <b>Stage a library for: {props.currentTokenId} </b>
              <Grid>
                <Box
                  sx={{
                    m: 2,
                  }}
                >
                  <Grid item xs={12}>
                    <FormControl>
                      <FormLabel id="radio-location-type"><b>Choose Location Type</b></FormLabel>
                      <RadioGroup
                        aria-labelledby="radio-location-type"
                        defaultValue="Canister"
                        name="radio-location-type"
                        onChange={handleRadioChange}
                        value={radioValue}
                      >
                        <FormControlLabel value="Canister" control={<Radio />} label="Canister" />
                        <FormControlLabel
                          value="Collection"
                          control={<Radio />}
                          label="Collection"
                        />
                        <FormControlLabel value="Web" control={<Radio />} label="Web" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Collapse in={openSelectInput} timeout="auto" unmountOnExit>
                    <CollectionLocation tokenId={props.currentTokenId} />
                  </Collapse>
                  <Collapse in={openFileInput} timeout="auto" unmountOnExit>
                    <CanisterLocation tokenId={props.currentTokenId} />
                  </Collapse>
                  <Collapse in={openWebInput} timeout="auto" unmountOnExit>
                    <WebLocation tokenId={props.currentTokenId} />
                  </Collapse>
                </Box>
              </Grid>
            </>
          )}
        </Typography>
      </Grid>
    </Grid>
  );
};
