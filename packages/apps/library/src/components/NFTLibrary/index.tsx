import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LibraryDefault from '../LayoutsType/LibraryDefault';
import { Layouts } from '../LayoutsType';
import { DeleteLibrary } from '../DeleteLibrary';

interface FileType {
  library_id: string;
  title: string;
  content_type: string;
  location: string;
  location_type: string;
  size: number;
}

export const NFTLibrary = (props: any) => {
  console.log(props);
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function capitalizeString(param) {
    return param.charAt(0).toUpperCase() + param.slice(1);
  }

  const LocationType = props.libDet.Class.filter((item) => item.name === 'location_type')[0].value.Text;
  const isMutable = props.libDet.Class.filter((item) => item.name === 'com.origyn.immutable_library')[0];
  

  let objLibraryData: FileType;
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


  console.log('objLibraryData', objLibraryData);

  return (
    <Grid container maxHeight={300} width={'max-content'}>
      <Grid item xs={12}>
        <Box>
          {objLibraryData?.content_type in Layouts ? (
            Layouts[objLibraryData.content_type](objLibraryData.location)
          ) : (
            <LibraryDefault source={objLibraryData.location} />
          )}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography
          sx={{ m: 2, fontSize: 17, marginBottom: '10px' }}
          color="text.primary"
          gutterBottom
        >
          <b>{objLibraryData.title}</b>
          <br></br>
          <b>{objLibraryData.content_type}</b> - {formatBytes(Number(objLibraryData.size))}
        </Typography>
        <Typography
          sx={{
            m: 2,
            fontSize: 14,
            borderBottom: '1px solid',
          }}
          color="text.secondary"
          gutterBottom
        >
          <b>Information</b>
        </Typography>
        <Typography
          sx={{ m: 2, fontSize: 14, marginBottom: '10px' }}
          color="text.primary"
          gutterBottom
        >
          <b>Library Id: </b>
          {objLibraryData.library_id + ''}
          <br></br>
          <b>Location type: </b>
          {capitalizeString(objLibraryData.location_type)}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <DeleteLibrary 
        libraryId={objLibraryData.library_id} 
        currentTokenId={props.currentTokenId}
        isMutable={isMutable}
        loggedIn = {props.loggedIn}
        />
      </Grid>
    </Grid>
  );
};
