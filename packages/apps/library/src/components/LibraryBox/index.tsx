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
    library_id: props.currentLibrary?.Class[0]?.value?.Text,
    title: props.currentLibrary?.Class[1]?.value?.Text,
    content_type: props.currentLibrary?.Class[4]?.value?.Text,
    location: props.currentLibrary?.Class[3]?.value?.Text,
    location_type: props.currentLibrary?.Class[2]?.value?.Text,
    size: props.currentLibrary?.Class[6]?.value?.Nat,
  };

  return (
    <Card
      variant="outlined"
      sx={{
        minWidth: 275,
        borderRadius: '0px',
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
              <b>LIBRARY ID:</b> {objLibraryData.library_id}
            </Typography>
            <Typography
              sx={{ m: 2, fontSize: 17, marginBottom: '10px' }}
              color="text.primary"
              gutterBottom
            >
              <b>TITLE:</b> {objLibraryData.title}
              <br></br>
            </Typography>
            <Typography
              sx={{ m: 2, fontSize: 17, marginBottom: '10px' }}
              color="text.primary"
              gutterBottom
            >
              <b>LOCATION TYPE:</b> {objLibraryData.location_type}
              <br></br>
            </Typography>
            <Typography
              sx={{ m: 2, fontSize: 17, marginBottom: '10px' }}
              color="text.primary"
              gutterBottom
            >
              <b>CONTENT TYPE:</b> {objLibraryData.content_type}
              <br></br>
            </Typography>
            <Typography
              sx={{ m: 2, fontSize: 17, marginBottom: '10px' }}
              color="text.primary"
              gutterBottom
            >
              <b>SIZE:</b> {formatBytes(Number(objLibraryData.size))}
              <br></br>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ m: 2 }}>
              {(() => {
                switch (objLibraryData.content_type) {
                  case 'image/png' || 'image/jpg':
                    return <LibraryImage source={objLibraryData.location} />;

                  case 'video/mp4' || 'video/html5':
                    return <LibraryVideo source={objLibraryData.location} />;

                  case 'text/html':
                    return <LibraryText source={objLibraryData.location} />;

                  default:
                    return <LibraryDefault source={objLibraryData.location} />;
                }
              })()}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LibraryBox;
