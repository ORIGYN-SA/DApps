import React from 'react';
import Box from '@mui/material/Box';

//Source test
//"https://nft.origyn.network/-/nftforgood_uffc/-/ogy.nftforgood_uffc.1/-/ogy.nftforgood_uffc.1.preview"

const LibraryImage = (props: any) => {
  return (
    <Box
      sx={{
        width: 'auto',
        height: 'auto',
        textAlign: 'center',
      }}
    >
      <img src={props.source} height="300px"></img>
    </Box>
  );
};

export default LibraryImage;
