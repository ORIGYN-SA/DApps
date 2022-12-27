import React, { useEffect } from 'react';
// LocationTypes
import { WebLocation } from './web_location';
import { CollectionLocation } from './collection_location';
import { CanisterLocation } from './canister_location';
import { LinearProgress } from '@mui/material';
import { Container, Toggle, Flex, HR, Select } from '@origyn-sa/origyn-art-ui';

const locationTypeLayouts = {
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

interface SelectType {
  value: string;
  label: string;
}

const canister: SelectType = {
  value: 'Canister',
  label: 'Canister',
};

const web: SelectType = {
  value: 'Web',
  label: 'Web',
};

const collection: SelectType = {
  value: 'Collection',
  label: 'Collection',
};

export const LibraryForm = (props: any) => {
  const [inProgress, setInProgress] = React.useState(false);
  const [choosenLocation, setChoosenLocation] = React.useState('');
  const [locationTypes, setLocationTypes] = React.useState<SelectType[]>([]);

  const handleSelectChange = (val) => {
    setChoosenLocation(val);
  };

  useEffect(() => {
    if(props.currentTokenId === '') {
      setLocationTypes([canister, web]);
    } else {
      setLocationTypes([canister,web,collection]);
    }
  }, [props.currentTokenId]);

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
              <HR marginTop={16} marginBottom={16} />
              <>
                <Flex flexFlow="column" gap={8}>
                  <Flex>Choose Location Type:</Flex>
                  <Flex>
                    <Select
                      selectedOption={{
                        value: choosenLocation,
                        label: choosenLocation,
                      }}
                      label="Select location type"
                      handleChange={(loc) => {
                        handleSelectChange(loc.value);
                      }}
                      options={locationTypes.map((loc) => {
                        return {
                          value: loc.value,
                          label: loc.label,
                        };
                      })}
                    />
                  </Flex>
                  <HR marginTop={16} marginBottom={16} />
                  {choosenLocation !== '' ? (
                    <Flex>{locationTypeLayouts[choosenLocation](setInProgress, '')}</Flex>
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
              <HR marginTop={16} marginBottom={16} />
              <>
                <>
                  <Flex flexFlow="column" gap={8}>
                    <Flex>Choose Location Type:</Flex>
                    <Flex>
                      <Select
                        selectedOption={{
                          value: choosenLocation,
                          label: choosenLocation,
                        }}
                        label="Select location type"
                        handleChange={(loc) => {
                          handleSelectChange(loc.value);
                        }}
                        options={locationTypes.map((loc) => {
                          return {
                            value: loc.value,
                            label: loc.label,
                          };
                        })}
                      />
                    </Flex>
                    <HR marginTop={16} marginBottom={16} />
                    {choosenLocation !== '' ? (
                      <Flex>
                        {locationTypeLayouts[choosenLocation](setInProgress, props.currentTokenId)}
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
