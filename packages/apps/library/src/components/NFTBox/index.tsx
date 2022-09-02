import React, { useContext, useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { AuthContext } from '@dapp/features-authentication';

interface NFTDATA {
  nft_id: string;
  preview?: string;
}

const NFTBox = (props: any) => {
  const { actor } = useContext(AuthContext);
  const { nftStuff, setNftStuff } = useState({});

  let nftData: NFTDATA = {
    nft_id: props.currentNft,
  };

  const nftDetails = async () => {
    const details = await actor?.nft_origyn(nftData.nft_id);
    console.log('here me', details);
    return setNftStuff(details);
  };

  useEffect(() => {
    if (actor) {
      nftDetails();
    }
  }, [actor]);

  const nftImage = nftStuff?.ok?.metadata?.Class.filter((res) => {
    return res.name === 'primary_asset';
  }).value.Text;

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
            <img src={nftImage} height="300px" alt="NFT Image"></img>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default NFTBox;
