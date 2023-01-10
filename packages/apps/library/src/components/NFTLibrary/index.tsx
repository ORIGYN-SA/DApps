import React from 'react';
import { Container, Grid, Flex, HR } from '@origyn-sa/origyn-art-ui';
import LibraryDefault from '../LayoutsType/LibraryDefault';
import { Layouts } from '../LayoutsType';
import { DeleteLibrary } from '../DeleteLibrary';
import { UpdateLibrary } from '../UpdateLibrary';
interface FileType {
  library_id: string;
  title: string;
  content_type: string;
  location: string;
  location_type: string;
  size: number;
}

export const NFTLibrary = (props: any) => {
  
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  let objLibraryData: FileType;
  let LocationType: string;
  let isMutable: string;
  if (props.libDet) {
    LocationType = props.libDet.Class.filter((item) => item.name === 'location_type')[0].value.Text;
    isMutable = props.libDet.Class.filter(
      (item) => item.name === 'com.origyn.immutable_library',
    )[0];
    const library = props.libDet;
    switch (LocationType) {
      case 'canister':
        objLibraryData = {
          library_id: library?.Class.filter((item) => item.name === 'library_id')[0].value.Text,
          title: library?.Class.filter((item) => item.name === 'title')[0].value.Text,
          content_type: library?.Class.filter((item) => item.name === 'content_type')[0].value.Text,
          location: library?.Class.filter((item) => item.name === 'location')[0].value.Text,
          location_type: LocationType,
          size: library?.Class.filter((item) => item.name === 'size')[0].value.Nat,
        };
        break;
      case 'collection':
        objLibraryData = {
          library_id: library?.Class.filter((item) => item.name === 'library_id')[0].value.Text,
          title: library?.Class.filter((item) => item.name === 'title')[0].value.Text,
          content_type: library?.Class.filter((item) => item.name === 'content_type')[0].value.Text,
          location: library?.Class.filter((item) => item.name === 'location')[0].value.Text,
          location_type: LocationType,
          size: library?.Class.filter((item) => item.name === 'size')[0].value.Nat,
        };
        break;
      case 'web':
        objLibraryData = {
          library_id: library?.Class.filter((item) => item.name === 'library_id')[0].value.Text,
          title: library?.Class.filter((item) => item.name === 'title')[0].value.Text,
          content_type: 'URL',
          location: library?.Class.filter((item) => item.name === 'location')[0].value.Text,
          location_type: LocationType,
          size: 0,
        };
        break;
    }
  }

  console.log('objLibraryData', objLibraryData);

  return (
    <Container padding="16px">
      <Grid columns={1}>
        <Grid column={1} padding="16px">
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
      <HR marginTop={16} marginBottom={16} />
      {props.loggedIn == true && props.owner == true ? (
        <>
          {!isMutable ? (
            <>
              <Flex flexFlow="column" justify="center" gap={16}>
                <Flex>
                  <DeleteLibrary
                    libraryId={objLibraryData.library_id}
                    currentTokenId={props.currentTokenId}
                    isMutable={isMutable}
                    updateTokenLibraryData={props.updateTokenLibraryData}
                    setOpenLibrarySelectedToken={props.setOpenLibrarySelectedToken}
                    setLibDet={props.setLibDet}
                  />
                </Flex>
                <Flex>
                  <UpdateLibrary
                  tokenId={props.currentTokenId} 
                  updateLibraryData={props.updateTokenLibraryData}
                  setOpenLibrary={props.setOpenLibrarySelectedToken}
                  locationType={objLibraryData.location_type}
                  metadata = {props.libDet}
                  />
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
