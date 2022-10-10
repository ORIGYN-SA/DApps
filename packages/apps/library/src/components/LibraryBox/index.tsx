import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {Layouts} from '../LayoutsType';
import LibraryDefault from '../LayoutsType/LibraryDefault';

interface curLibraryData {
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


const LibraryBox = (props: any) => {
  
  let objLibraryData: curLibraryData = {
    library_id: props.library3?.Class[0]?.value?.Text,
    title: props.library3?.Class[1]?.value?.Text,
    content_type: props.library3?.Class[4]?.value?.Text,
    location: props.library3?.Class[3]?.value?.Text,
    location_type: props.library3?.Class[2]?.value?.Text,
    size: props.library3?.Class[6]?.value?.Nat,
  };

  return (
    <Grid 
    container
    maxHeight={300}
    width={'max-content'}
    >
      <Grid item xs={12}>
        <Box>
          {
            (objLibraryData.content_type in Layouts) ? (
              Layouts[objLibraryData.content_type](objLibraryData.location)
            ) : (
              <LibraryDefault source={objLibraryData.location} />
            )
          }
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography
          sx={{ m: 2, fontSize: 17, marginBottom: '10px' }}
          color="text.primary"
          gutterBottom
        >
          <b>{objLibraryData.library_id}</b>
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
          <b>Library Id: </b>{objLibraryData.library_id}
          <br></br> 
          <b>Location type: </b>{objLibraryData.location_type}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default LibraryBox;
