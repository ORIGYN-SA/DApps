import React, { useEffect } from 'react';
// mint.js
import { OrigynClient, getNftCollectionMeta } from '@origyn-sa/mintjs';
// LocationTypes
import { WebLocation } from './web_location';
import { CollectionLocation } from './collection_location';
import { CanisterLocation } from './canister_location';
import { useRoute } from '../../../../../features/authentication';
import { LinearProgress } from '@mui/material';
import { Container, Toggle, Flex } from '@origyn-sa/origyn-art-ui';

export const LocationTypeLayouts = {
  Canister: (setInProgress: string, tokenId: string) => (
    <CanisterLocation setInProgress={setInProgress} tokenId={tokenId} />
  ),
  Web: (setInProgress: string, tokenId: string) => (
    <WebLocation setInProgress={setInProgress} tokenId={tokenId} />
  ),
  Collection: (setInProgress: string, tokenId: string) => (
    <CollectionLocation setInProgress={setInProgress} tokenId={tokenId} />
  ),
};

export const LibraryForm = (props: any) => {
  const [inProgress, setInProgress] = React.useState(false);
  const [isCheckedCanister, setIsCheckedCanister] = React.useState(false);
  const [isCheckedWeb, setIsCheckedWeb] = React.useState(false);
  const [isCheckedCollection, setIsCheckedCollection] = React.useState(false);
  const [choosenLocation, setChoosenLocation] = React.useState('');

  const handleCanisterToggleChange = () => {
    setIsCheckedCanister(true);
    setIsCheckedWeb(false);
    setIsCheckedCollection(false);

    setChoosenLocation('Canister');
  };
  const handleWebToggleChange = () => {
    setIsCheckedCanister(false);
    setIsCheckedWeb(true);
    setIsCheckedCollection(false);

    setChoosenLocation('Web');
  };
  const handleCollectionToggleChange = () => {
    setIsCheckedCanister(false);
    setIsCheckedWeb(false);
    setIsCheckedCollection(true);

    setChoosenLocation('Collection');
    getLibraries();
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
                <Flex flexFlow="column" gap={8}>
                  <Flex>Choose Location Type:</Flex>
                  <Flex>
                    <Flex flexFlow="row" gap={8}>
                      <Flex>
                        <Toggle
                          checked={isCheckedCanister}
                          handleToggle={handleCanisterToggleChange}
                        />
                      </Flex>
                      <Flex>
                        <b>Canister</b>
                      </Flex>
                    </Flex>
                  </Flex>
                  <Flex>
                    <Flex flexFlow="row" gap={8}>
                      <Flex>
                        <Toggle checked={isCheckedWeb} handleToggle={handleWebToggleChange} />
                      </Flex>
                      <Flex>
                        <b>Web</b>
                      </Flex>
                    </Flex>
                  </Flex>
                  {choosenLocation !== '' ? (
                    <Flex>{LocationTypeLayouts[choosenLocation](setInProgress, '')}</Flex>
                  ) : (
                    <>
                      <Flex>Select a location type to continue!</Flex>
                    </>
                  )}
                </Flex>
              </>
            </>
          ) : (
            <>
              <b>Stage a library for: {props.currentTokenId} </b>
              <>
                <>
                  <Flex flexFlow="column" gap={8}>
                    <Flex>Choose Location Type:</Flex>
                    <Flex>
                      <Flex flexFlow="row" gap={8}>
                        <Flex>
                          <Toggle
                            checked={isCheckedCanister}
                            handleToggle={handleCanisterToggleChange}
                          />
                        </Flex>
                        <Flex>
                          <b>Canister</b>
                        </Flex>
                      </Flex>
                    </Flex>
                    <Flex>
                      <Flex flexFlow="row" gap={8}>
                        <Flex>
                          <Toggle checked={isCheckedWeb} handleToggle={handleWebToggleChange} />
                        </Flex>
                        <Flex>
                          <b>Web</b>
                        </Flex>
                      </Flex>
                    </Flex>
                    <Flex>
                      <Flex flexFlow="row" gap={8}>
                        <Flex>
                          <Toggle
                            checked={isCheckedCollection}
                            handleToggle={handleCollectionToggleChange}
                          />
                        </Flex>
                        <Flex>
                          <b>Collection</b>
                        </Flex>
                      </Flex>
                    </Flex>

                    {choosenLocation !== '' ? (
                      <Flex>
                        {LocationTypeLayouts[choosenLocation](setInProgress, props.currentTokenId)}
                      </Flex>
                    ) : (
                      <>
                        <Flex>Select a location type to continue!</Flex>
                      </>
                    )}
                  </Flex>
                </>
              </>
            </>
          )}
        </>
      )}
    </Container>
  );
};
