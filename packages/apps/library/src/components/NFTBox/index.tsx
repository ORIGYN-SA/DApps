import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface NFTDATA {
  nft_id: string;
  preview: string;
}

const NFTBox = (props: any) => {
  let nftData: NFTDATA = {
    nft_id: props.currentNft?.Class[0]?.value?.Text,
    preview: props.currentNft?.Class[1]?.value?.Text,
  };

  return (
    <div>
      <Card
        variant="outlined"
        sx={{
          minWidth: 275,
          width: '30rem',
          borderRadius: '0px',
        }}
      >
        <CardContent>
          <Typography sx={{ marginBottom: '1rem' }}>
            NFT ID: <b> {nftData.nft_id} </b>
          </Typography>
          <Box>
            <img src={nftData.preview} height="300px"></img>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default NFTBox;
