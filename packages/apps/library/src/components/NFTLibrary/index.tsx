import React,{useEffect} from 'react';
import { Container, Grid, Flex, HR } from '@origyn-sa/origyn-art-ui';
import LibraryDefault from '../LayoutsType/LibraryDefault';
import { Layouts } from '../LayoutsType';
import { DeleteLibrary } from '../DeleteLibrary';
import { UpdateLibrary } from '../UpdateLibrary';

interface SimplifiedMeta {
  library_id: string;
  title: string;
  content_type: string;
  location: string;
  location_type: string;
  size: number;
  isMutable: boolean;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const NFTLibrary = (props: any) => {

  const [objLibraryData, setObjLibraryData] = React.useState<SimplifiedMeta>({
    library_id: '',
    title: '',
    content_type: '',
    location: '',
    location_type: '',
    size: 0,
    isMutable: false,
  });

  const processMetadata = async () => {
    const metadata = await props.libDet;
    const libraryId = metadata.Class?.filter((res) => res.name === 'library_id')[0].value.Text;
    const title = metadata.Class?.filter((res) => res.name === 'title')[0].value.Text;
    const contentType = metadata.Class?.filter((res) => res.name === 'content_type')[0].value.Text;
    const location = metadata.Class?.filter((res) => res.name === 'location')[0].value.Text;
    const locationType = metadata.Class?.filter((res) => res.name === 'location_type')[0].value.Text;
    const size = metadata.Class?.filter((res) => res.name === 'size')[0].value.Nat;
    let isMutable = false;
    if (props.libDet.Class.filter(
      (item) => item.name === 'com.origyn.immutable_library',
    )[0]) {
      isMutable = false
    } else {
      isMutable = true;
    }
    setObjLibraryData({
      library_id: libraryId,
      title: title,
      content_type: contentType,
      location: location,
      location_type: locationType,
      size: Number(size),
      isMutable: isMutable,
    });
    console.log(objLibraryData);
  }

  useEffect(() => {
    processMetadata();
  }, [props.libDet]);

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
          {objLibraryData.isMutable ? (
            <>
              <Flex flexFlow="column" justify="center" gap={16}>
                <Flex>
                  <DeleteLibrary
                    libraryId={objLibraryData.library_id}
                    currentTokenId={props.currentTokenId}
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
                    metadata={props.libDet}
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
