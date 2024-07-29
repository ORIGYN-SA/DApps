import React, { useState, useContext } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { PerpetualOSContext } from '@dapp/features-context-provider';
import { useSnackbar } from 'notistack';
import type { StageFile } from '@origyn/mintjs/lib/methods/nft/types';
// mint.js
import { OrigynClient, stageWebLibraryAsset, getNft, getNftCollectionMeta } from '@origyn/mintjs';
import { TextInput, Button, HR, Flex, CheckboxInput, Container } from '@origyn/origyn-art-ui';

export const WebLocation = (props: any) => {
  const context = useContext(PerpetualOSContext);
  const { actor } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [typedUrl, setTypedUrl] = useState('');
  const [typedTitle, setTypedTitle] = useState('');
  const [typedId, setTypedId] = useState('');
  const [immutable, setImmutable] = React.useState(false);
  const handleChangeImmutable = () => {
    setImmutable(!immutable);
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
    await OrigynClient.getInstance().init(!context.isLocal, context.canisterId, { actor });
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
      console.error(e);
    }
    props.setInProgress(false);
    props.isOpen(false);

    if (props.tokenId == '') {
      //Update the library data for the collection
      getNftCollectionMeta().then((r) => {
        props.updateData(
          (r.ok?.metadata[0]?.['Class'] || []).filter((res) => {
            return res.name === 'library';
          })[0]?.value?.Array || [],
        );
      });
    } else {
      //Update the library data for the Token
      getNft(props.tokenId).then((r) => {
        if (r.ok && r.ok.metadata && 'Class' in r.ok.metadata) {
          const libraryData = r.ok.metadata.Class.find((res) => res.name === 'library');
          const libraryArray = libraryData && libraryData.value ? libraryData.value['Array'] : [];
          props.updateData(libraryArray);
        }
      });
    }
  };

  return (
    <>
      <Container size="full">
        <Flex flexFlow="column" gap={8}>
          <Flex>
            <TextInput
              label="Library title"
              id="title"
              placeholder="Enter Title"
              onChange={getTypedTitle}
            />
          </Flex>
          <Flex>
            <TextInput label="Library Id" id="id" placeholder="Library ID" onChange={getTypedId} />
          </Flex>
          <Flex>
            <TextInput
              label="URL"
              id="web"
              placeholder="https://www.example.com"
              onChange={getTypedUrl}
            />
          </Flex>
          <HR marginTop={16} marginBottom={16} />
          <Flex>
            <Flex flexFlow="row" gap={8}>
              <Flex>
                <CheckboxInput
                  name="immutable"
                  onChange={handleChangeImmutable}
                  checked={immutable}
                />
              </Flex>
              <Flex>
                <p>
                  Make this Library <b>immutable</b>
                </p>
              </Flex>
            </Flex>
          </Flex>
          <HR marginTop={16} marginBottom={16} />
          <Flex>
            <Button btnType="filled" onClick={StageWebLibrary}>
              Stage Library
            </Button>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};
