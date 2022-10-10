import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, getTokenId, getCanisterId } from '@dapp/features-authentication';
import Grid from '@mui/material/Grid';
import NFTLibrary from '../NFTLibrary';
import { getNftCollection, getNft, OrigynClient } from '@origyn-sa/mintjs';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import MuiListItemButton from '@mui/material/ListItemButton';
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
  noPadding: {
    padding: 0,
  },
  styledScroll: {
    overflow: 'scroll',
    '&::-webkit-scrollbar': {
      width: '0.4em',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#ffffff'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#9a9a9a',
      borderRadius: '5px'
    }
  }
}));

const ListItemButton = withStyles({
  root: {
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: "#151515",
      color: "#ffffff",
    },
    '&$selected, &$selected:hover': {
      backgroundColor: "#151515",
      color: "#ffffff",
    },
  },
})(MuiListItemButton);

const ColumnView = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [selectedNft, setSelectedNft] = React.useState(0);
  const [selectedMeta, setSelectedMeta] = React.useState(0);
  const [selectedLibrary, setSelectedLibrary] = React.useState(0);
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
  const [library3, setLibrary3] = useState();
  const [openDub, setOpenDub] = useState(false);
  const classes = useStyles();
  const { actor, canisterId } = useContext(AuthContext);
  const [collectionNft, setCollectionNft] = useState([]);

  const currentCanisterId = async () => {
    const canisterId = await getCanisterId();
    return canisterId;
  }

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setOpen(!open);
    setOpen1(false);
    setOpenLib(false);
    setOpera(false);
    setOpenDetails(false);
    setOpenDub(false);
    setOpenDeta(false);
    nftCollection();
    setSelectedIndex(index);
  };

  const handleClick1 = async (
    nft,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,) => {
    setOpen1(!open1);
    setOpenLib(false);
    setOpera(false);
    setOpenDetails(false);
    setOpenDeta(false);
    handleDetails();
    setSelectedNft(index);
    OrigynClient.getInstance().init(await currentCanisterId());
    getNft(nft).then((r) => {
      console.log('nft_origyn', r);
      setLibraryData(
        r.ok.metadata.Class.filter((res) => {
          return res.name === 'library';
        })[0].value.Array.thawed,
      );
    });
  };

  const handleClickLib = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setOpenLib(!openLib);
    setOpen(false);
    setOpen1(false);
    setOpera(false);
    setOpenDetails(false);
    setOpenDeta(false);
    setOpenDub(false);
    setSelectedIndex(index);
    // As default-general view of libraries the tokenId is empty
    if (actor) {
      OrigynClient.getInstance().init(await currentCanisterId());
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
  };

  const handleDeta = async (
    lib,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setOpenDeta(!openDeta);
    setLibDet(lib);
    setSelectedMeta(index);
  };

  const handleClick3 = (
    lib3,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setOpenDub(!open);
    setLibrary3(lib3);
    setSelectedLibrary(index);
  };

  const openSpecificNft = async () => {

    if (getTokenId() !== '') {
      setOpen(!open);
      setOpenLib(false);
      setOpera(false);
      setOpenDetails(false);
      setOpenDub(false);
      setOpenDeta(false);
      await nftCollection();
      setOpen1(!open1);
      handleDetails();

      OrigynClient.getInstance().init(await currentCanisterId());
      const curTokenId = await getTokenId();
      setSelectedIndex(0);
      setSelectedNft((await nftCollection()).indexOf(curTokenId));
      getNft(curTokenId).then((r) => {
        setLibraryData(
          r.ok.metadata.Class.filter((res) => {
            return res.name === 'library';
          })[0].value.Array.thawed,
        );
      });
    }
  };

  const nftCollection = async () => {
    setCollectionNft([])
    OrigynClient.getInstance().init(await currentCanisterId());
    const response = await getNftCollection([]);
    const collectionNFT = response.ok;
    const obj_token_ids: any = collectionNFT.token_ids[0];

    setCollectionNft(obj_token_ids);

    // In case we have URL with tokenID and we change canister, 
    // We need to check if the tokenID is in the new canister
    // If not, we need to clear the URL and show the first tokenID in the new Canister
    if (!obj_token_ids.includes(getTokenId()) && getTokenId() !== '') {
      let Url = window.location.href;
      Url = Url.replace(getTokenId(), obj_token_ids[0]);
      window.location.href = Url;
    }
    return obj_token_ids;
  };

  // If tokenID is in the URL, open the library of the specific tokenID
  useEffect(() => {
    openSpecificNft();
  }, []);


  return (
    <div>
      <Box
        component={Paper}
        elevation={2}
        sx={{ margin: 2, width: '100%', padding: 2 }}
      >
        <Grid
          container
          minHeight={300}
          overflow={'scroll'}
          className={classes.styledScroll}
        >
          <List
            className={classes.horizontal}>
            <Box
              minHeight={300}
              borderRight={1}
            >
              <Grid
                container
                minWidth={250}>
                <Grid item xs={12}>
                  <ListItem
                    className={
                      classes.noPadding
                    }>
                    <ListItemText
                      primary={canisterId} />
                  </ListItem>
                </Grid>
              </Grid>
            </Box>

            <Box
              minHeight={300}
              borderRight={1}
            >
              <Grid
                container
                minWidth={250}>
                <Grid
                  item
                  xs={12}>
                  <ListItem
                    className={classes.noPadding}>
                    <ListItemButton
                      selected={selectedIndex === 0}
                      onClick={(event) => handleClick(event, 0)}
                      className={classes.noPadding}>
                      <ListItemText
                        sx={{ paddingLeft: 1 }}
                        primary="NFTs" />
                    </ListItemButton>
                  </ListItem>
                </Grid>

                <Grid
                  item
                  xs={12}>
                  <ListItem
                    className={classes.noPadding}>
                    <ListItemButton
                      selected={selectedIndex === 1}
                      onClick={(event) => handleClickLib(event, 1)}
                      className={classes.noPadding}>
                      <ListItemText
                        sx={{ paddingLeft: 1 }}
                        primary="Libraries" />
                    </ListItemButton>
                  </ListItem>
                </Grid>
              </Grid>
            </Box>

            <Collapse
              in={open}
              timeout="auto"
              unmountOnExit>
              <Box
                minHeight={300}
                borderRight={1}
                className={classes.styledScroll}
              >
                <Grid
                  container
                  minWidth={250}>
                  {
                    (collectionNft.length <= 0) ? (
                      <Grid
                        container
                        minWidth={250}>
                        <Grid
                          item
                          xs={12}>
                          <ListItem
                            className={classes.noPadding}>
                            <ListItemText
                              sx={{ paddingLeft: 1 }}
                              primary="Loading data..." />
                          </ListItem>
                        </Grid>
                      </Grid>
                    ) : (

                      <Grid
                        container
                        minWidth={250}
                        maxHeight={300}
                      >
                        <Grid
                          item
                          xs={12}>
                          {collectionNft?.map((nft, index) => (
                            <ListItem
                              className={classes.noPadding}
                              key={index}>
                              <ListItemButton
                                selected={selectedNft === index}
                                onClick={(event) => handleClick1(nft, event, index)}
                                className={classes.noPadding} >
                                <ListItemText
                                  sx={{ paddingLeft: 1 }}
                                  primary={nft} />
                              </ListItemButton>
                            </ListItem>
                          ))}

                        </Grid>
                      </Grid>

                    )
                  }
                </Grid>
              </Box>
            </Collapse>

            <Collapse
              in={openDetails}
              timeout="auto"
              unmountOnExit>
              <Box
                minHeight={300}
                borderRight={1}
                className={classes.styledScroll}
              >
                <Grid
                  container
                  minWidth={250}>
                  <Grid
                    item
                    xs={12}>
                    {libraryData?.map((library, index) => (
                      <ListItem
                        key={index}
                        className={classes.noPadding}
                      >
                        <ListItemButton
                          className={classes.noPadding}
                          selected={selectedMeta === index}
                          onClick={(event) => handleDeta(library, event, index)}>
                          <ListItemText
                            sx={{ paddingLeft: 1 }}
                            primary={library?.Class[1]?.value?.Text}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </Grid>
                </Grid>
              </Box>
            </Collapse>


            <Collapse
              in={openDeta}
              timeout="auto"
              unmountOnExit>
              <Box
                maxHeight={300}
                borderRight={1}
                className={classes.styledScroll}
              >
                <Grid
                  container
                  minWidth={250}>
                  <Grid item xs={12}>
                  <NFTLibrary
                    libDet={libDet} />
                  </Grid>
                </Grid>

              </Box>
            </Collapse>


            <Collapse
              in={openLib}
              timeout="auto"
              unmountOnExit>
              <Box
                minHeight={300}
                borderRight={1}
                className={classes.styledScroll}
              >
                <Grid
                  container

                  maxHeight={300}
                >
                  <Grid
                    onClick={handleClickLib1}
                    item
                    xs={12} >
                    {defaultLibraryData?.map((library, index) => (
                      <ListItem
                        className={classes.noPadding}
                        key={index}>
                        <ListItemButton
                          selected={selectedLibrary === index}
                          onClick={(event) => handleClick3(library, event, index)}
                          className={classes.noPadding}
                        >
                          <ListItemText
                            sx={{ paddingLeft: 1 }}
                            primary={library?.Class[0]?.value?.Text}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </Grid>
                </Grid>
              </Box>
            </Collapse>

            <Collapse
              in={openDub}
              timeout="auto">
              <Box
                minHeight={300}
                borderRight={1}
              >
                <Grid
                  item
                  xs={12}>
                  <LibraryBox
                    library3={library3} />
                </Grid>
              </Box>
            </Collapse>
          </List>
        </Grid>
      </Box>
    </div>
  );
};

export default ColumnView;
