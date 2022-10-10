import React, { useContext, useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { AuthContext } from '@dapp/features-authentication';
import { getNft } from '@origyn-sa/mintjs';
import LibraryImage from '../LibraryImage';
import LibraryVideo from '../LibraryVideo';
import LibraryTextHtml from '../LibraryTextHtml';
import LibraryDefault from '../LibraryDefault';

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
      getNft(props.currentNft).then((r) => {
        console.log('nft_origyn NFTBox', r);
        setNftStuff(r);
      });
    }
  }, [actor]);

  const nftContentType = nftStuff?.ok?.metadata?.Class?.filter((res) => {
    return res.name === 'library';})[0].value?.Array?.thawed[0].Class.filter((res) => {
      return res.name === 'content_type';
    })[0].value.Text;

  console.log('nft_origyn NFTBox nftContentType', nftContentType);

  const nftLocation = nftStuff?.ok?.metadata?.Class?.filter((res) => {
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
        
            border: '1px solid black',
          
          borderRadius: '0px',
        }}
      >
        <CardContent>
          <Typography sx={{ marginBottom: '1rem' }}>
            NFT ID: <b> {nftData.nft_id} </b>
          </Typography>
          <Box>
          {(() => {
                switch (nftContentType) {
                  case 'image/png' || 'image/jpg':
                    return <LibraryImage source={nftLocation} />;
                  case 'image/jpeg' || 'image/gif':
                    return <LibraryImage source={nftLocation} />;
                  case 'video/mp4' || 'video/html5':
                    return <LibraryVideo source={nftLocation} />;
                  case 'text/html':
                    return <LibraryTextHtml source={nftLocation} />;

                  default:
                    return <LibraryDefault source={nftLocation} />;
                }
              })()}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default NFTBox;
