import React from 'react';
import Box from '@mui/material/Box';

const LibraryImage = (props: any) => {
  return (
    <Box
      sx={{
        width: 'auto',
        height: 'auto',
        textAlign: 'center',
      }}
    >
      <img src={props.source} height="200px"></img>
    </Box>
  );
};

export default LibraryImage;
