import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { PerpetualOSContext } from '@dapp/features-context-provider';
import { useSnackbar } from 'notistack';
import {
  OrigynClient,
  stageCollectionLibraryAsset,
  getNftCollectionMeta,
  getNft,
} from '@origyn/mintjs';
import type { StageFile } from '@origyn/mintjs/lib/methods/nft/types';
import { Select, TextInput, Button, HR, Flex, Container } from '@origyn/origyn-art-ui';

export const CollectionLocation = (props: any) => {
  const context = useContext(PerpetualOSContext);
  const { actor } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [libraries, setLibraries] = React.useState<any>([]);
  const [selectedLibrary, setSelectedLibrary] = React.useState<any>(null);
  const [typedTitle, setTypedTitle] = useState('');

  const getTypedTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedTitle(event.target.value);
  };

  const getLibraries = async () => {
    await OrigynClient.getInstance().init(!context.isLocal, context.canisterId, { actor });
    const response = await getNftCollectionMeta();
    const library = await response?.ok?.metadata[0]?.['Class'].filter((res) => {
      return res.name === 'library';
    })[0].value.Array;
    let libraries: { Class: { name: string; value: { Text: string }[] }[] }[] = [];
    let i: any;
    for (i in library) {
      libraries.push(
        library[i].Class.filter((res: any) => {
          return res.name === 'libraryId';
        })[0].value.Text,
      );
    }
    setLibraries(libraries);
    setSelectedLibrary(libraries[0]);
  };

  const StageCollectionLibrary = async () => {
    await OrigynClient.getInstance().init(!context.isLocal, context.canisterId, { actor });
    props.setInProgress(true);
    try {
      const CollectionFile: StageFile = {
        filename: typedTitle,
        title: typedTitle,
        path: '',
        libraryId: selectedLibrary?.Class?.[0]?.value?.[0]?.Text || '',
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
      console.error('error', e);
    }

    props.setInProgress(false);
    props.isOpen(false);

    if (props.tokenId == '') {
      //Update the library data for the collection
      getNftCollectionMeta().then((r) => {
        if (r.ok && r.ok.metadata[0] && 'Class' in r.ok.metadata[0]) {
          const libraryArray = r.ok.metadata[0]?.Class?.filter((res) => {
            return res.name === 'library';
          })[0]?.value?.['Array'];
          props.updateData(libraryArray || []);
        }
      });
    } else {
      //Update the library data for the Token
      getNft(props.tokenId).then((r) => {
        if (r.ok && r.ok.metadata[0] && 'Class' in r.ok.metadata[0]) {
          props.updateData(
            r.ok.metadata[0].Class.filter((res) => {
              return res.name === 'library';
            })[0].value.Array,
          );
        }
      });
    }
  };
  const handleSelectChange = (val) => {
    setSelectedLibrary(val);
  };

  useEffect(() => {
    getLibraries();
  }, []);

  return (
    <>
      <Container size="full">
        <Flex flexFlow="column" gap={8}>
          <Flex>
            <TextInput
              id="title"
              label="Library title"
              placeholder="Enter Title"
              onChange={getTypedTitle}
            />
          </Flex>

          <Flex>
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
          </Flex>
          <HR marginTop={16} marginBottom={16} />
          <Flex>
            <Button btnType="filled" onClick={StageCollectionLibrary}>
              Stage Library
            </Button>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};
