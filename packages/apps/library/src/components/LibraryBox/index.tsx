import React from 'react';
import { Layouts } from '../LayoutsType';
import LibraryDefault from '../LayoutsType/LibraryDefault';
import { DeleteLibrary } from '../DeleteLibrary';
import { Container, Grid, HR, Flex } from '@origyn-sa/origyn-art-ui';
import { UpdateLibraryFile } from '../UpdateLibraryFile';

interface FileType {
  library_id: string;
  title: string;
  content_type: string;
  location: string;
  location_type: string;
  size: number;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const LibraryBox = (props: any) => {
  console.log('props', props);
  const LocationType = props.library3.Class.filter((item) => item.name === 'location_type')[0].value
    .Text;
  const isMutable = props.library3.Class.filter(
    (item) => item.name === 'com.origyn.immutable_library',
  )[0];
  let objLibraryData: FileType;
  switch (LocationType) {
    case 'canister':
      objLibraryData = {
        library_id: props.library3?.Class.filter((item) => item.name === 'library_id')[0].value
          .Text,
        title: props.library3?.Class.filter((item) => item.name === 'title')[0].value.Text,
        content_type: props.library3?.Class.filter((item) => item.name === 'content_type')[0].value
          .Text,
        location: props.library3?.Class.filter((item) => item.name === 'location')[0].value.Text,
        location_type: LocationType,
        size: props.library3?.Class.filter((item) => item.name === 'size')[0].value.Nat,
      };
      break;
    case 'collection':
      objLibraryData = {
        library_id: props.library3?.Class.filter((item) => item.name === 'library_id')[0].value
          .Text,
        title: props.library3?.Class.filter((item) => item.name === 'title')[0].value.Text,
        content_type: props.library3?.Class.filter((item) => item.name === 'content_type')[0].value
          .Text,
        location: props.library3?.Class.filter((item) => item.name === 'location')[0].value.Text,
        location_type: LocationType,
        size: props.library3?.Class.filter((item) => item.name === 'size')[0].value.Nat,
      };
      break;
    case 'web':
      objLibraryData = {
        library_id: props.library3?.Class.filter((item) => item.name === 'library_id')[0].value
          .Text,
        title: props.library3?.Class.filter((item) => item.name === 'title')[0].value.Text,
        content_type: 'URL',
        location: props.library3?.Class.filter((item) => item.name === 'location')[0].value.Text,
        location_type: LocationType,
        size: 0,
      };
      break;
  }

  return (
    <Container padding="16px">
      <Grid columns={1}>
        <Grid column={1}>
          {objLibraryData.content_type in Layouts ? (
            Layouts[objLibraryData.content_type](objLibraryData.location)
          ) : (
            <LibraryDefault source={objLibraryData.location} />
          )}
        </Grid>
      </Grid>
      <Grid columns={1}>
        <Grid column={1}>
          <b>{objLibraryData.title}</b>
          <span style={{ color: 'grey' }}>
            {objLibraryData.content_type} - {formatBytes(Number(objLibraryData.size))}
          </span>
          <br />
          Library Id:
          <span style={{ color: 'grey' }}>{objLibraryData.library_id}</span>
          <br></br>
          Location type:
          <span style={{ color: 'grey' }}>{objLibraryData.location_type}</span>
        </Grid>
      </Grid>
      <HR marginTop={16} marginBottom={16}/>
      {props.loggedIn == true && props.owner == true ? (
        <>
          {!isMutable ? (
            <>
              <Flex flexFlow="column" justify="center" gap={16}>
                <Flex>
                  <DeleteLibrary
                    libraryId={objLibraryData.library_id}
                    currentTokenId={''}
                    isMutable={isMutable}
                  />
                </Flex>
                <Flex>
                  <UpdateLibraryFile libraryId={objLibraryData.library_id} tokenId={''} />
                </Flex>
              </Flex>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </Container>
  );
};
