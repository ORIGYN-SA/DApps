import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LibraryDefault from '../LayoutsType/LibraryDefault';
import {Layouts} from '../LayoutsType';

export const NFTLibrary = (props: any) => {
  let library = props.libDet;
  console.log(library);

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function capitalizeString(param){
    return param.charAt(0).toUpperCase() + param.slice(1);
  }

  return (
      <Grid 
      container
      maxHeight={300}
      width={'max-content'}
      >
        <Grid item xs={12}>
          <Box>
            {
              (library?.Class[4]?.value?.Text in Layouts) ? (
                Layouts[library?.Class[4]?.value?.Text](library.Class[3]?.value.Text)
              ) : (
                <LibraryDefault source={library.Class[3]?.value.Text} />
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
            <b>{library?.Class[1]?.value?.Text}</b>
            <br></br>
            <b>{library?.Class[4]?.value?.Text}</b> - {formatBytes(Number(library?.Class[6]?.value?.Nat))}
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
            <b>Library Id: </b>{library?.Class[0]?.value?.Text + ''}
            <br></br> 
            <b>Location type: </b>{capitalizeString(library?.Class[2]?.value?.Text)}     
          </Typography>
        </Grid>
      </Grid>
  );
};

