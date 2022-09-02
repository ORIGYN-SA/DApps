import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { TreeItem } from '@mui/lab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';


const NFTLibrary = (props: any) => {
  const { libraryData, setLibraryData } = useState([]);
  const [currentLibrary, setCurrentLibrary] = useState();
  const { actor } = useContext(AuthContext);

  let signed = {
    id: props.currentNft,
  };
//
  const nftLibrariesData = async () => {
    const lib = await actor?.nft_origyn(signed.id);
    console.log('here is library of NFT', lib);
    return setLibraryData(
      lib.ok.metadata.Class.filter((res) => {
        return res.name === 'library';
      })[0].value.Array.thawed,
    );
  };

  useEffect(() => {
    if (actor) {
      nftLibrariesData();
    }
  }, [actor]);

  return (
    <div>
      {libraryData?.map((library) => (
        <TreeItem
          key={library?.Class[0]?.value?.Text}
          nodeId={library?.Class[0]?.value?.Text}
          label={library?.Class[1]?.value?.Text}
          onClick={() => setCurrentLibrary(library)}

        >

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
              <b>LIBRARY ID:</b> {library?.Class[0]?.value?.Text}
            </Typography>
            {console.log("bau", library?.Class[0]?.value?.Text)}
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
              <br></br>
            </Typography>

            <Typography
              sx={{ m: 2, fontSize: 17, marginBottom: '10px' }}
              color="text.primary"
              gutterBottom
            >
              <br></br>
            </Typography>
          </Grid>

        </Grid>
      </CardContent>
    </Card>
       </TreeItem>
      ))}
    </div>
  );
};

export default NFTLibrary;
