import React, { useState, useContext } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { useSnackbar } from 'notistack';
import type { StageFile } from '@origyn-sa/mintjs/lib/methods/nft/types';
// mint.js
import { OrigynClient, stageWebLibraryAsset } from '@origyn-sa/mintjs';
import { TextInput, Button, HR, Flex, Toggle, Container } from '@origyn-sa/origyn-art-ui';

export const WebLocation = (props: any) => {
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
        <Flex>
          <Flex flexFlow="row" gap={8}>
            <Flex>
              <Toggle checked={immutable} handleToggle={handleChangeImmutable} />
            </Flex>
            <Flex>{immutable ? 'Library is immutable' : 'Library is mutable'}</Flex>
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
