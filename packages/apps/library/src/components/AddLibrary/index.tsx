import React, { useEffect } from 'react';
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
import { useRoute } from '../../../../../features/authentication';
import { LinearProgress } from '@mui/material';
import { Container, Grid } from '@origyn-sa/origyn-art-ui';

export const LibraryForm = (props: any) => {
  const [radioValue, setRadioValue] = React.useState('Canister');
  const [openFileInput, setOpenFileInput] = React.useState(false);
  const [openSelectInput, setOpenSelectInput] = React.useState(false);
  const [openWebInput, setOpenWebInput] = React.useState(false);
  const [inProgress, setInProgress] = React.useState(false);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
  };

  const getLibraries = async () => {
    const { canisterId } = await useRoute();

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
    <Container padding="16px">
      {inProgress ? (
        <>
          <h4>Staging in Progress</h4>
          <br />
          <LinearProgress color="secondary" />
        </>
      ) : (
        <>
          {props.currentTokenId === '' ? (
            <>
              <b>Stage a library for the collection</b>
              <>
                <Grid columns={1}>
                  <Grid column={1}>
                    Choose Location Type:
                    <br />
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="radio-location-type"
                        defaultValue="Canister"
                        name="radio-location-type"
                        onChange={handleRadioChange}
                        value={radioValue}
                      >
                        <FormControlLabel value="Canister" control={<Radio />} label="Canister" />
                        <FormControlLabel value="Web" control={<Radio />} label="Web" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Collapse in={openFileInput} timeout="auto" unmountOnExit>
                    <CanisterLocation 
                     setInProgress={setInProgress}
                    tokenId={props.currentTokenId} />
                  </Collapse>
                  <Collapse in={openWebInput} timeout="auto" unmountOnExit>
                    <WebLocation 
                     setInProgress={setInProgress}
                    tokenId={props.currentTokenId} />
                  </Collapse>
                </Grid>
              </>
            </>
          ) : (
            <>
              <b>Stage a library for: {props.currentTokenId} </b>
              <Grid columns={1}>
                <Grid column={1}>
                  <FormControl>
                    <FormLabel id="radio-location-type">
                      <b>Choose Location Type</b>
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="radio-location-type"
                      defaultValue="Canister"
                      name="radio-location-type"
                      onChange={handleRadioChange}
                      value={radioValue}
                    >
                      <FormControlLabel value="Canister" control={<Radio />} label="Canister" />
                      <FormControlLabel value="Collection" control={<Radio />} label="Collection" />
                      <FormControlLabel value="Web" control={<Radio />} label="Web" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Collapse in={openSelectInput} timeout="auto" unmountOnExit>
                  <CollectionLocation 
                  setInProgress={setInProgress}
                  tokenId={props.currentTokenId} 
                  updateTokenLibraryData={props.updateTokenLibraryData}
                  />
                </Collapse>
                <Collapse in={openFileInput} timeout="auto" unmountOnExit>
                  <CanisterLocation 
                  setInProgress={setInProgress}
                  tokenId={props.currentTokenId} 
                  updateTokenLibraryData={props.updateTokenLibraryData}

                  />
                </Collapse>
                <Collapse in={openWebInput} timeout="auto" unmountOnExit>
                  <WebLocation 
                  setInProgress={setInProgress}
                  tokenId={props.currentTokenId} 
                  updateTokenLibraryData={props.updateTokenLibraryData}
                  />
                </Collapse>
              </Grid>
            </>
          )}
        </>
      )}
    </Container>
  );
};
