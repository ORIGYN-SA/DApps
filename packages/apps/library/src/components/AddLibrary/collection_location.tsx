import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { useSnackbar } from 'notistack';
// mint.js
import { OrigynClient, stageCollectionLibraryAsset, getNftCollectionMeta } from '@origyn-sa/mintjs';
import type { StageFile } from '@origyn-sa/mintjs/lib/methods/nft/types';
import { Container, Grid, Select, TextInput, Button, HR } from '@origyn-sa/origyn-art-ui';

export const CollectionLocation = (props: any) => {
  const { actor } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [libraries, setLibraries] = React.useState<any>([]);
  const [selectedLibrary, setSelectedLibrary] = React.useState('');
  const [typedTitle, setTypedTitle] = useState('');

  const getTypedTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedTitle(event.target.value);
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
    setLibraries(libraries);
    setSelectedLibrary(libraries[0]);
  };

  const StageCollectionLibrary = async () => {
    const { canisterId } = await useRoute();
    await OrigynClient.getInstance().init(true, canisterId, { actor });
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
  const handleSelectChange = (val) => {
    setSelectedLibrary(val);
  };

  useEffect(() => {
    getLibraries();
  }, []);

  return (
    <Container padding="16px">
      <Grid>
        <TextInput id="title" placeholder="Enter Title" onChange={getTypedTitle} />
      </Grid>
      <Container>
        <Select
          selectedOption={{
            value: selectedLibrary,
            label: selectedLibrary,
          }}
          label="Select"
          handleChange={(opt) => {
            handleSelectChange(opt.value);
          }}
          options={libraries.map((lib) => {
            return {
              value: lib,
              label: lib,
            };
          })}
        />
      </Container>
        <Grid>
          <Button onClick={() => StageCollectionLibrary()}>STAGE LIBRARY</Button>
        </Grid>
    </Container>
  );
};
