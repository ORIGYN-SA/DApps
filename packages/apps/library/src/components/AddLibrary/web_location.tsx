import React, { useState, useContext } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { useSnackbar } from 'notistack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import type { StageFile } from '@origyn-sa/mintjs/lib/methods/nft/types';
// mint.js
import { OrigynClient, stageWebLibraryAsset, getNft } from '@origyn-sa/mintjs';
import { Grid, Container, TextInput, Button, HR, Flex } from '@origyn-sa/origyn-art-ui';

export const WebLocation = (props: any) => {
  const { actor } = useContext(AuthContext);

  const { enqueueSnackbar } = useSnackbar();

  const [typedUrl, setTypedUrl] = useState('');
  const [typedTitle, setTypedTitle] = useState('');
  const [typedId, setTypedId] = useState('');
  const [immutable, setImmutable] = React.useState(false);
  const handleChange = (event) => {
    setImmutable(event.target.value);
    console.log(event.target.value);
  };

  const getTypedId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedId(event.target.value);
  };

  const getTypedTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedTitle(event.target.value);
  };

  const getTypedUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedUrl(event.target.value);
  };

  const StageWebLibrary = async () => {
    const { canisterId } = await useRoute();

    await OrigynClient.getInstance().init(true, canisterId, { actor });
    props.setInProgress(true);
    try {
      const WebFile: StageFile = {
        filename: typedTitle,
        immutable: immutable,
        webUrl: typedUrl,
        path: '',
        libraryId: typedId,
        title: typedTitle,
      };
      const response = await stageWebLibraryAsset(props.tokenId, WebFile);
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
    props.setInProgress(false);

  };

  return (
    <Container padding="16px">
      <Grid>
        <TextInput id="title" placeholder="Enter Title" onChange={getTypedTitle} />
      </Grid>
      <Grid>
        <TextInput id="id" placeholder="Library ID" onChange={getTypedId} />
      </Grid>
      <Grid>
        <TextInput id="web" placeholder="https://www.example.com" onChange={getTypedUrl} />
      </Grid>
      <Grid>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Make library mutable or not</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="Mutable"
            name="radio-buttons-group"
            value={immutable}
            onChange={handleChange}
          >
            <FormControlLabel value={false} control={<Radio />} label="Mutable" />
            <FormControlLabel value={true} control={<Radio />} label="Immutable" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <HR marginTop={16} marginBottom={16}/>
      <Flex align="center" justify="center">
        <Flex>
          <Button btnType="filled" onClick={StageWebLibrary}>
            Stage Library
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};
