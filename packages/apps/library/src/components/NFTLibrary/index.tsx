import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LibraryImage from '../LibraryImage';
import LibraryVideo from '../LibraryVideo';
import LibraryText from '../LibraryText';
import LibraryDefault from '../LibraryDefault';

const NFTLibrary = (props: any) => {
  let library = props.libDet;

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div>
      <Card
        variant="outlined"
        sx={{
          minWidth: 275,
          borderRadius: '0px',
          border: '1px solid black',
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                sx={{
                  m: 2,
                  fontSize: 17,
                  borderBottom: '1px solid',
                  marginBottom: '30px',
                }}
                color="text.secondary"
                gutterBottom
              >
                <b>LIBRARY ID:</b> {library?.Class[0]?.value?.Text + ''}
              </Typography>
              <Typography
                sx={{ m: 2, fontSize: 17, marginBottom: '10px' }}
                color="text.primary"
                gutterBottom
              >
                <b>TITLE:</b> {library?.Class[1]?.value?.Text}
                <br></br>
              </Typography>
              <Typography
                sx={{ m: 2, fontSize: 17, marginBottom: '10px' }}
                color="text.primary"
                gutterBottom
              >
                <b>LOCATION TYPE:</b> {library?.Class[2]?.value?.Text}
                <br></br>
              </Typography>
              <Typography
                sx={{ m: 2, fontSize: 17, marginBottom: '10px' }}
                color="text.primary"
                gutterBottom
              >
                <b>CONTENT TYPE:</b> {library?.Class[4]?.value?.Text}
                <br></br>
              </Typography>
              <Typography
                sx={{ m: 2, fontSize: 17, marginBottom: '10px' }}
                color="text.primary"
                gutterBottom
              >
                <b>SIZE:</b> {formatBytes(Number(library?.Class[6]?.value?.Nat))}
                <br></br>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ m: 2 }}>
                {(() => {
                  switch (library?.Class[4]?.value?.Text) {
                    case 'image/png' || 'image/jpg':
                      return <LibraryImage source={library?.Class[3]?.value?.Text} />;

                    case 'video/mp4' || 'video/html5':
                      return <LibraryVideo source={library?.Class[3]?.value?.Text} />;

                    case 'text/html':
                      return <LibraryText source={library?.Class[3]?.value?.Text} />;

                    default:
                      return <LibraryDefault source={library?.Class[3]?.value?.Text} />;
                  }
                })()}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default NFTLibrary;
