import React, { useEffect } from 'react';
import { WebLocation } from './web_location';
import { CollectionLocation } from './collection_location';
import { CanisterLocation } from './canister_location';
import { LoadingContainer } from '@dapp/features-components';
import { Container, Flex, HR, Select } from '@origyn/origyn-art-ui';

interface PropsLayout {
  setInProgress: React.Dispatch<React.SetStateAction<boolean>>;
  tokenId: string;
  isOpen: boolean;
  updateData: React.Dispatch<React.SetStateAction<any[]>>;
}

const locationTypeLayouts = {
  Canister: (setInProgress, tokenId, isOpen, updateData: PropsLayout) => (
    <CanisterLocation
      setInProgress={setInProgress}
      tokenId={tokenId}
      isOpen={isOpen}
      updateData={updateData}
    />
  ),
  Web: (setInProgress: any, tokenId: string, isOpen: void, updateData: void) => (
    <WebLocation
      setInProgress={setInProgress}
      tokenId={tokenId}
      isOpen={isOpen}
      updateData={updateData}
    />
  ),
  Collection: (setInProgress: any, tokenId: string, isOpen: void, updateData: void) => (
    <CollectionLocation
      setInProgress={setInProgress}
      tokenId={tokenId}
      isOpen={isOpen}
      updateData={updateData}
    />
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
    if (props.currentTokenId === '') {
      setLocationTypes([canister, web]);
    } else {
      setLocationTypes([canister, web, collection]);
    }
  }, [props.currentTokenId]);

  return (
    <Container padding="16px">
      {inProgress ? (
        <>
          <h4>Staging in Progress</h4>
          <br />
          <LoadingContainer margin="24px" />
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
                    <Flex>
                      {locationTypeLayouts[choosenLocation](
                        setInProgress,
                        '',
                        props.setOpenCollection,
                        props.updateDataCollection,
                      )}
                    </Flex>
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
                        {locationTypeLayouts[choosenLocation](
                          setInProgress,
                          props.currentTokenId,
                          props.setOpen,
                          props.updateDataToken,
                        )}
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
