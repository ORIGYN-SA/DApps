import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, getTokenId, getCanisterId } from '@dapp/features-authentication';
import NFTBox from '../NFTBox';
import Grid from '@mui/material/Grid';
import NFTLibrary from '../NFTLibrary';
import { getNftCollection, getNft, OrigynClient } from '@origyn-sa/mintjs';
import { makeStyles } from '@material-ui/core/styles';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import { ListItemButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box } from '@mui/system';
import LibraryBox from '../LibraryBox';

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

const ColumnView = () => {
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [openLib, setOpenLib] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);
  // General Library -- tokenId empty
  const [defaultLibraryData, setDefaultLibraryData] = useState<Array<any>>([]);
  // Specific library -- tokenId from URL or from clicked item
  const [libraryData, setLibraryData] = useState<Array<any>>([]);
  const [openDeta, setOpenDeta] = useState(false);
  const [libDet, setLibDet] = useState();
  const [opera, setOpera] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [libData3, setLibData3] = useState([]);
  const [library3, setLibrary3] = useState();
  const [openDub, setOpenDub] = useState(false);
  const classes = useStyles();
  const { actor, canisterId } = useContext(AuthContext);
  const [nfts, setNfts] = useState([]);
  const [currentNft, setCurrentNft] = useState();

  const currentCanisterId = async () => {
    const canisterId = await getCanisterId();
    return canisterId;
  }

  const handleClick = () => {
    setOpen(!open);
    setOpen1(false);
    setOpenLib(false);
    setOpera(false);
    setOpenDetails(false);
    setOpenDub(false);
    setOpenDeta(false);
    nftCollection();
    getNft(getTokenId())
      .then((r) => {
        console.log(r);
        setLibData3(
          r.ok.metadata.Class.filter((res) => {
            return res.name === 'library';
          })[0].value.Array.thawed,
        );
        console.log('This is R', r);
      })

  };

  const handleClick1 = async (nft) => {
    setOpen1(!open1);
    setCurrentNft(nft);
    setOpenLib(false);
    setOpera(false);
    setOpenDetails(false);
    setOpenDeta(false);
  };

  const handleClickLib = async () => {
    setOpenLib(!openLib);
    setOpen(false);
    setOpen1(false);
    setOpera(false);
    setOpenDetails(false);
    setOpenDeta(false);
    setOpenDub(false);
    // As default-general view of libraries the tokenId is empty
    if (actor) {
      getNft('').then((r) => {
        setDefaultLibraryData(
          r.ok.metadata.Class.filter((res) => {
            return res.name === 'library';
          })[0].value.Array.thawed,
        );
      });
    }

  };

  const handleClickLib1 = () => {
    setOpera(!opera);
    setOpenDetails(false);
    setOpenDeta(false);
  };

  const handleDetails = () => {
    setOpenDetails(!openDetails);
    setOpenDeta(false);
    if (actor) {
      getNft(currentNft).then((r) => {
        console.log('nft_origyn', r);
        setLibraryData(
          r.ok.metadata.Class.filter((res) => {
            return res.name === 'library';
          })[0].value.Array.thawed,
        );
      });
    }
  };

  const handleDeta = async (lib) => {
    setOpenDeta(!openDeta);
    setLibDet(lib);
  };

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleClick3 = (lib3) => {
    setOpenDub(!open);
    setLibrary3(lib3);
  };

  const boxStyle = {
    backgroundColor: isHover ? 'gray' : '',
  };

  const openSpecificNft = async () => {
    if (getTokenId() !== '') {
      await handleClick();
      await handleClick1(getTokenId());
    }
  };

  const nftCollection = async () => {
    setNfts(['']);
    OrigynClient.getInstance().init(await currentCanisterId());
    const response = await getNftCollection([]);
    const collectionNFT = response.ok;
    const obj_token_ids = collectionNFT.token_ids;
    const arrayTokenIds = [];
    for (var x in obj_token_ids) {
      arrayTokenIds.push(obj_token_ids[x]);
    }

  // In case we have URL with tokenID and we change canister, 
  // We need to check if the tokenID is in the new canister
  // If not, we need to clear the URL and show the first tokenID in the new Canister

    if(!arrayTokenIds[0].includes(getTokenId())){
      let Url = window.location.href;
      Url = Url.replace(getTokenId(), arrayTokenIds[0][0]);
      window.location.href = Url;
    }
    return setNfts(arrayTokenIds[0]);
  };


  // If tokenID is in the URL, open the library of the specific tokenID
  useEffect(() => {
    openSpecificNft();
  }, []);

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

            <Collapse in={open1} timeout="auto" unmountOnExit>
              <Grid item>
                <ListItem className={classes.vertical}>
                  <NFTBox currentNft={currentNft} />
                </ListItem>
                <ListItemButton
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
                </ListItemButton>
              </Grid>
            </Collapse>
            {/* bun */}

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

            <Collapse in={openLib} timeout="auto" unmountOnExit>
              <Grid item onClick={handleClickLib1}>
                {defaultLibraryData?.map((library, index) => (
                  <ListItemButton
                    key={index}
                    sx={{
                      border: '1px solid black',
                    }}
                  >
                    <ListItemText
                      primary={library?.Class[0]?.value?.Text}
                      onClick={() => handleClick3(library)}
                    />
                    {openDub ? <ChevronLeft /> : <ChevronRight />}
                  </ListItemButton>
                ))}
              </Grid>
            </Collapse>

            <Collapse in={openDub} timeout="auto">
              <Grid item>
                <LibraryBox library3={library3} />
              </Grid>
            </Collapse>
          </List>
        </Grid>
      </Box>
    </div>
  );
};

export default ColumnView;
