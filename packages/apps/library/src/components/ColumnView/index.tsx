import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import NFTBox from '../NFTBox';
import Grid from '@mui/material/Grid';
import NFTLibrary from '../NFTLibrary';
import { getNftCollection, getNft } from '@origyn-sa/mintjs';
import { makeStyles } from '@material-ui/core/styles';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import { ListItemButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box } from '@mui/system';

const useStyles = makeStyles(() => ({
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  vertical: {
    flexDirection: 'column',
    padding: 0,
  },
}));

const ColumnView = ({ children }: any) => {
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [openLib, setOpenLib] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [libraryData, setLibraryData] = useState<Array<any>>([]);
  const [openDeta, setOpenDeta] = useState(false);
  const [libDet, setLibDet] = useState();
  const [opera, setOpera] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClick1 = async (nft) => {
    setOpen1(!open1);
    setCurrentNft(nft);
  };

  const handleClickLib = () => {
    setOpenLib(!openLib);
  };

  const handleClickLib1 = () => {
    setOpera(!opera);
  };

  const handleDetails = () => {
    setOpenDetails(!openDetails);
  };

  const handleDeta = async (lib) => {
    setOpenDeta(!openDeta);
    setLibDet(lib);
  };

  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const boxStyle = {
    //...
    backgroundColor: isHover ? 'gray' : '',
  };

  const classes = useStyles();
  const { actor, canisterId } = useContext(AuthContext);
  const [nfts, setNfts] = useState([]);
  const [currentNft, setCurrentNft] = useState();

  const nftCollection = async () => {
    const response = await getNftCollection([]);
    const collectionNFT = response.ok;
    const obj_token_ids = collectionNFT.token_ids;

    const arrayTokenIds = [];
    for (var x in obj_token_ids) {
      var newID = obj_token_ids[x];
      arrayTokenIds.push(newID);
    }

    return setNfts(arrayTokenIds[0]);
  };

  console.log(nfts);

  useEffect(() => {
    if (actor) {
      nftCollection();
    }
  }, [actor]);

  useEffect(() => {
    if (actor) {
      getNft(currentNft).then((r) => {
        console.log('nft_origyn NFTLibrary', r);
        setLibraryData(
          r.ok.metadata.Class.filter((res) => {
            return res.name === 'library';
          })[0].value.Array.thawed,
        );
      });
    }
  }, [handleDeta]);

  console.log('this is current NFT, ', currentNft);

  return (
    <div>
      <Box sx={{ marginLeft: '1rem', border: '2px black' }}>
        <Grid container>
          <List className={classes.horizontal}>
            <Grid item>
              <ListItem
                sx={{
                  border: '1px solid black',
                }}
              >
                <ListItemText primary={canisterId} />
                <ChevronRight />
              </ListItem>
            </Grid>

            <Box sx={{ border: '1px black' }}>
              {/* List item for NFTs */}
              <Grid container>
                <Grid item xs={12}>
                  <ListItem
                    sx={{
                      border: '1px solid black',
                    }}
                  >
                    <ListItemButton onClick={handleClick}>
                      <ListItemText primary="NFTs" />
                      {open ? <ChevronLeft /> : <ChevronRight />}
                    </ListItemButton>
                  </ListItem>
                </Grid>

                {/* List item "Libraries" */}

                <Grid item xs={12}>
                  <ListItem
                    sx={{
                      border: '1px solid black',
                    }}
                  >
                    <ListItemButton onClick={handleClickLib}>
                      <ListItemText primary="Libraries" />
                      {openLib ? <ChevronLeft /> : <ChevronRight />}
                    </ListItemButton>
                  </ListItem>
                </Grid>
              </Grid>
            </Box>

            {/* Collapse for NFTs List */}

            <Collapse in={open} timeout="auto" unmountOnExit>
              <Grid item>
                <ListItem className={classes.vertical} sx={{ border: '1px solid black' }}>
                  {nfts?.map((nft, index) => (
                    <ListItemButton key={index} onClick={() => handleClick1(nft)}>
                      <ListItemText primary={nft} />
                      {open1 ? <ChevronLeft /> : <ChevronRight />}
                    </ListItemButton>
                  ))}
                </ListItem>
              </Grid>
            </Collapse>

            {/* Collapse for NFT Box  */}

            <Collapse in={open1} timeout="auto" unmountOnExit>
              <Grid item>
                <ListItem className={classes.vertical}>
                  <NFTBox currentNft={currentNft} />

                  <ListItem
                    style={boxStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleDetails}
                    sx={{ border: '1px solid black' }}
                  >
                    <ListItemText
                      sx={{
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        hover: 'gray',
                      }}
                      primary="Open NFT Libraries >"
                    />
                  </ListItem>
                </ListItem>
              </Grid>
            </Collapse>

            {/* Collpase for NFT Libraries */}

            {/* Main issue with NFT Box and NFT Library, NFT Librray is geerating whole componnet with hooks etc, NFT Box is just a card component */}

            <Collapse in={openDetails} timeout="auto" unmountOnExit>
              {libraryData?.map((library, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: '1px solid black',
                  }}
                >
                  <ListItemButton>
                    <ListItemText
                      primary={library?.Class[1]?.value?.Text}
                      onClick={() => handleDeta(library)}
                    />
                    {openDeta ? <ChevronLeft /> : <ChevronRight />}
                  </ListItemButton>
                </ListItem>
              ))}
            </Collapse>

            <Grid item>
              <Collapse in={openDeta} timeout="auto" unmountOnExit>
                <NFTLibrary libDet={libDet} />
              </Collapse>
            </Grid>

            {/* Collapse for Library */}

            <Collapse in={openLib} timeout="auto" unmountOnExit>
              <Grid item onClick={handleClickLib1}>
                {children}
              </Grid>
            </Collapse>
          </List>
        </Grid>
      </Box>
    </div>
  );
};

export default ColumnView;
