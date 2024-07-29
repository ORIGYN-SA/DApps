import React, { useEffect } from 'react';
import { Layouts } from '../LayoutsType';
import LibraryDefault from '../LayoutsType/LibraryDefault';
import { DeleteLibrary } from '../DeleteLibrary';
import { Container, Grid, HR, Flex } from '@origyn/origyn-art-ui';
import { UpdateLibrary } from '../UpdateLibrary';
import { immutableLibrary } from '../Constants/constants';

interface SimplifiedMeta {
  library_id: string;
  title: string;
  content_type: string;
  location: string;
  location_type: string;
  size: number;
  immutable: boolean;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const CollectionLibrary = (props: any) => {
  const [simplifiedLibraryMeta, setSimplifiedLibraryMeta] = React.useState<SimplifiedMeta>({
    library_id: '',
    title: '',
    content_type: '',
    location: '',
    location_type: '',
    size: 0,
    immutable: false,
  });

  const processMetadata = async () => {
    const metadata = props.collectionLevelLibraryMetadata.Class;
    if (metadata.length > 0) {
      const libraryId =
        metadata.filter((res) => res.name === 'library_id')[0].value.Text || 'No Library ID';
      const title = metadata.filter((res) => res.name === 'title')[0].value.Text || 'No Title';
      const contentType =
        metadata.filter((res) => res.name === 'content_type')[0].value.Text || 'No Content Type';
      const location =
        metadata.filter((res) => res.name === 'location')[0].value.Text || 'No Location';
      const locationType =
        metadata.filter((res) => res.name === 'location_type')[0].value.Text || '';
      const size = metadata.filter((res) => res.name === 'size')[0].value.Nat || 0;
      let immutable = false;
      if (metadata.filter((item) => item.name === immutableLibrary)[0]) {
        immutable = true;
      }
      setSimplifiedLibraryMeta({
        library_id: libraryId,
        title: title,
        content_type: contentType,
        location: location,
        location_type: locationType,
        size: Number(size),
        immutable: immutable,
      });
    } else {
      return;
    }
  };

  useEffect(() => {
    processMetadata();
  }, [props.collectionLevelLibraryMetadata]);

  return (
    <Container padding="16px">
      <Grid columns={1}>
        <Grid columns={1}>
          {simplifiedLibraryMeta.content_type in Layouts ? (
            Layouts[simplifiedLibraryMeta.content_type](simplifiedLibraryMeta.location)
          ) : (
            <LibraryDefault source={simplifiedLibraryMeta.location} />
          )}
        </Grid>
      </Grid>
      <Grid columns={1}>
        <Grid columns={1}>
          <b>{simplifiedLibraryMeta.title}</b>
          <span style={{ color: 'grey' }}>
            {simplifiedLibraryMeta.content_type} - {formatBytes(Number(simplifiedLibraryMeta.size))}
          </span>
          <br />
          Library Id:
          <span style={{ color: 'grey' }}>{simplifiedLibraryMeta.library_id}</span>
          <br></br>
          Location type:
          <span style={{ color: 'grey' }}>{simplifiedLibraryMeta.location_type}</span>
        </Grid>
      </Grid>
      <HR marginTop={16} marginBottom={16} />
      {props.loggedIn == true && props.owner == true ? (
        <>
          {!simplifiedLibraryMeta.immutable ? (
            <>
              <Flex flexFlow="column" justify="center" gap={16}>
                <Flex>
                  <DeleteLibrary
                    libraryId={simplifiedLibraryMeta.library_id}
                    currentTokenId={''}
                    isMutable={simplifiedLibraryMeta.immutable}
                    updateCollectionLevelLibraryData={props.updateCollectionLevelLibraryData}
                    setOpenLibraryCollectionLevel={props.setOpenLibraryCollectionLevel}
                    setCollectionLevelLibraryMetadata={props.setCollectionLevelLibraryMetadata}
                  />
                </Flex>
                <Flex>
                  <UpdateLibrary
                    tokenId={''}
                    updateLibraryData={props.updateCollectionLevelLibraryData}
                    setOpenLibrary={props.setOpenLibraryCollectionLevel}
                    locationType={simplifiedLibraryMeta.location_type}
                    metadata={props.collectionLevelLibraryMetadata}
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
