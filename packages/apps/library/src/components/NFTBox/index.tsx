import React, { useContext, useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { AuthContext } from '@dapp/features-authentication';

interface NFTDATA {
  nft_id?: string;
  preview?: string;
  nftImage?: any;
}

const NFTBox = (props: any) => {
  const { actor } = useContext(AuthContext);
  const [nftStuff, setNftStuff] = useState<any>();

  let nftData: NFTDATA = {
    nft_id: props.currentNft,
  };

  useEffect(() => {
    if (actor) {
      actor.nft_origyn(nftData.nft_id).then((r) => {
        console.log('nft_origyn NFTBox', r);
        setNftStuff(r);
      });
    }
  }, [actor]);

  // const nftImage : NFTDATA = nftStuff?.ok?.metadata?.Class.filter((res) => {
  //   return res.name === 'primary_asset';

  const nftImage = nftStuff?.ok?.metadata?.Class?.filter((res) => {
    return res.name === 'library';
  })[0].value?.Array?.thawed[0].Class.filter((res) => {
    return res.name === 'location';
  })[0].value.Text;

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
            <img src={nftImage} height="300px"></img>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default NFTBox;
