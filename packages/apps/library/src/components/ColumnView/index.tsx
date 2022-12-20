import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { getNft, OrigynClient, getNftCollectionMeta } from '@origyn-sa/mintjs';
import { checkOwner } from '@dapp/utils';
// Import from style.tsx
import { Sizes, ListItemButton, useStyles } from './style';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import { Box } from '@mui/system';
// Library components
import { CollectionLibrary } from '../CollectionLibrary';
import { NFTLibrary } from '../NFTLibrary';
import { LibraryForm } from '../AddLibrary';
import { Container } from '@origyn-sa/origyn-art-ui';

const ColumnView = () => {

  const classes = useStyles();
  const { actor, loggedIn, principal } = useContext(AuthContext);

  const [canisterId, setCanisterId] = useState('');

  const [collectionNft, setCollectionNft] = useState([]);
  const [owner, setOwner] = React.useState<boolean>(false);
  const [currentTokenId, setCurrentTokenId] = useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [selectedNft, setSelectedNft] = React.useState(0);
  const [selectedMeta, setSelectedMeta] = React.useState(0);
  const [selectedLibrary, setSelectedLibrary] = React.useState(0);
  const [openCollectionLevel, setOpenCollectionLevel] = React.useState(false);
  const [openLib, setOpenLib] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);
  // Collection level Libraries -- tokenId empty
  const [collectionLevelLibraryData, setCollectionLevelLibraryData] = useState<Array<any>>([]);
  // Specific library -- tokenId from URL or from clicked item
  const [tokenLibraryData, setTokenLibraryData] = useState<Array<any>>([]);
  const [openAddLibrary, setOpenAddLibrary] = React.useState(false);
  const [openLibrarySelectedToken, setOpenLibrarySelectedToken] = useState(false);
  const [openLibraryCollectionLevel, setOpenLibraryCollectionLevel] = useState(false);
  const [libDet, setLibDet] = useState();
  const [library3, setLibrary3] = useState();
  const [openAddLibraryCollectionLevel, setOpenAddLibraryCollectionLevel] = React.useState(false);

  const handleClickOnNfts = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setOpenCollectionLevel(!openCollectionLevel);
    setOpenLib(false);
    setOpenDetails(false);
    setOpenLibraryCollectionLevel(false);
    setOpenLibrarySelectedToken(false);
    setOpenAddLibrary(false);
    setOpenAddLibraryCollectionLevel(false);
    nftCollection();
    setSelectedIndex(index);
  };

  const handleClickOnSelectedNft = async (
    nft,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    const { canisterId } = await useRoute();
    setOpenLib(false);
    setOpenDetails(false);
    setOpenLibrarySelectedToken(false);
    setOpenAddLibrary(false);
    handleDetails();
    setSelectedNft(index);
    setCurrentTokenId(nft);
    OrigynClient.getInstance().init(true, canisterId);
    getNft(nft).then((r) => {
      console.log('nft_origyn', r);
      setTokenLibraryData(
        r.ok.metadata.Class.filter((res) => {
          return res.name === 'library';
        })[0].value.Array.thawed,
      );
    });
  };

  const handleClickOnCollectionLevel= async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setOpenLib(!openLib);
    setOpenCollectionLevel(false);
    setOpenDetails(false);
    setOpenLibrarySelectedToken(false);
    setOpenLibraryCollectionLevel(false);
    setOpenAddLibrary(false);
    setOpenAddLibraryCollectionLevel(false);
    setSelectedIndex(index);
    // Collection level libraries the tokenId is empty
    if (actor) {
      OrigynClient.getInstance().init(true, canisterId);
      getNftCollectionMeta().then((r) => {
        setCollectionLevelLibraryData(
          r.ok.metadata[0].Class.filter((res) => {
            return res.name === 'library';
          })[0].value.Array.thawed,
        );
      });
    }
  };

  const handleClickLib1 = () => {
    setOpenDetails(false);
    setOpenLibrarySelectedToken(false);
    setOpenAddLibrary(false);
  };

  const handleDetails = () => {
    setOpenDetails(true);
    setOpenLibrarySelectedToken(false);
    setOpenAddLibrary(false);
  };

  const handleDeta = async (
    lib,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setOpenLibrarySelectedToken(true);
    setLibDet(lib);
    setSelectedMeta(index);
    setOpenAddLibrary(false);
  };

  const showCollectionLevelLibraryData = (
    lib3,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setLibrary3(lib3);
    setSelectedLibrary(index);
    setOpenLibraryCollectionLevel(true);
    setOpenAddLibrary(false);
    setOpenAddLibraryCollectionLevel(false);
  };

  const handleAddLibrary = () => {
    setOpenAddLibrary(!openAddLibrary);
    setOpenLib(false);
    setOpenDetails(false);
    setOpenLibraryCollectionLevel(false);
    setOpenLibrarySelectedToken(false);
  };

  const handleAddLibraryAtCollection = () => {
    setOpenAddLibraryCollectionLevel(!openAddLibraryCollectionLevel);
    setOpenLib(false);
    setOpenDetails(false);
    setOpenLibraryCollectionLevel(false);
    setOpenLibrarySelectedToken(false);
  };

  const openSpecificNft = async () => {
    const { tokenId, canisterId } = await useRoute();
    if (tokenId !== '') {
      setOpenCollectionLevel(!openCollectionLevel);
      setOpenLib(false);
      setOpenDetails(false);
      setOpenLibraryCollectionLevel(false);
      setOpenLibrarySelectedToken(false);
      setOpenAddLibrary(false);
      await nftCollection();
      handleDetails();
      OrigynClient.getInstance().init(true, canisterId);
      setCurrentTokenId(tokenId);
      setSelectedIndex(0);
      setSelectedNft((await nftCollection()).indexOf(tokenId));
      getNft(tokenId).then((r) => {
        setTokenLibraryData(
          r.ok.metadata.Class.filter((res) => {
            return res.name === 'library';
          })[0].value.Array.thawed,
        );
      });
    }
  };

  const nftCollection = async () => {
    const { tokenId, canisterId } = await useRoute();
    setCollectionNft([]);
    OrigynClient.getInstance().init(true, canisterId);
    const response = await getNftCollectionMeta([]);
    console.log('responseCollectionMeta', response);
    const collectionNFT = response.ok;
    const obj_token_ids: any = collectionNFT.token_ids[0];
    setCollectionNft(obj_token_ids);
    // In case we have URL with tokenID and we change canister,
    // We need to check if the tokenID is in the new canister
    // If not, we need to clear the URL and show the first tokenID in the new Canister
    if (!obj_token_ids.includes(tokenId) && tokenId !== '') {
      let Url = window.location.href;
      Url = Url.replace(tokenId, obj_token_ids[0]);
      window.location.href = Url;
      setCurrentTokenId(obj_token_ids[0]);
    }
    return obj_token_ids;
  };

  // If tokenID is in the URL, open the library of the specific tokenID
  useEffect(() => {
    openSpecificNft();

    useRoute().then(({ canisterId, tokenId }) => {
      setCanisterId(canisterId);
    });
    console.log('actor', actor);
  }, []);

  const checkAndSetOwner = async () => {
    const { tokenId, canisterId } = await useRoute();
    const checked = await checkOwner(principal, canisterId, tokenId);
    setOwner(checked);
  };

  useEffect(() => {
    if (loggedIn) {
      checkAndSetOwner();
    }
  }, [canisterId, currentTokenId]);

  return (
    <div>
      <Container>
        <Grid
          container
          minHeight={Sizes.minHeight}
          overflow={'scroll'}
          className={classes.classes['styledScroll']}
        >
          <List className={classes.classes['horizontal']}>
            <Box minHeight={Sizes.minHeight} borderRight={1}>
              <Grid container minWidth={Sizes.minWidth}>
                <Grid item xs={12}>
                  <ListItem className={classes.classes['noPadding']}>
                    <ListItemButton
                      selected={selectedIndex === 0}
                      onClick={(event) => handleClickOnNfts(event, 0)}
                      className={classes.classes['noPadding']}
                    >
                      <ListItemText sx={{ paddingLeft: 1 }} primary="NFTs" />
                    </ListItemButton>
                  </ListItem>
                </Grid>
                <Grid item xs={12}>
                  <ListItem className={classes.classes['noPadding']}>
                    <ListItemButton
                      selected={selectedIndex === 1}
                      onClick={(event) => handleClickOnCollectionLevel(event, 1)}
                      className={classes.classes['noPadding']}
                    >
                      <ListItemText sx={{ paddingLeft: 1 }} primary="Collection" />
                    </ListItemButton>
                  </ListItem>
                </Grid>
              </Grid>
            </Box>
            <Collapse in={openCollectionLevel} timeout="auto" unmountOnExit>
              <Box
                minHeight={Sizes.minHeight}
                borderRight={1}
                className={classes.classes['styledScroll']}
              >
                <Grid container minWidth={Sizes.minWidth}>
                  <Grid container minWidth={Sizes.minWidth} maxHeight={Sizes.maxHeight}>
                    <Grid item xs={12}>
                      {collectionNft?.map((nft, index) => (
                        <ListItem className={classes.classes['noPadding']} key={index}>
                          <ListItemButton
                            selected={selectedNft === index}
                            onClick={(event) => handleClickOnSelectedNft(nft, event, index)}
                            className={classes.classes['noPadding']}
                          >
                            <ListItemText
                              primary={nft}
                              sx={{ width: 'max-content', paddingLeft: 1 }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>

            <Collapse in={openDetails} timeout="auto" unmountOnExit>
              <Box
                minHeight={Sizes.minHeight}
                borderRight={1}
                className={classes.classes['styledScroll']}
              >
                <Grid container minWidth={Sizes.minWidth}>
                  <Grid item xs={12}>
                    {owner && loggedIn ? (
                      <>
                        <ListItem className={classes.classes['noPadding']}>
                          <ListItemButton
                            className={classes.classes['noPadding']}
                            onClick={() => handleAddLibrary()}
                          >
                            <ListItemText
                              sx={{ width: 'max-content', paddingLeft: 1, fontWeight: 'bold' }}
                              primary="+ Add a Library"
                            />
                          </ListItemButton>
                        </ListItem>
                      </>
                    ) : (
                      <></>
                    )}
                    {tokenLibraryData?.map((library, index) => (
                      <ListItem key={index} className={classes.classes['noPadding']}>
                        <ListItemButton
                          className={classes.classes['noPadding']}
                          selected={selectedMeta === index}
                          onClick={(event) => handleDeta(library, event, index)}
                        >
                          <ListItemText
                            sx={{ width: 'max-content', paddingLeft: 1 }}
                            primary={library?.Class[1]?.value?.Text}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </Grid>
                </Grid>
              </Box>
            </Collapse>

            <Collapse in={openLib} timeout="auto" unmountOnExit>
              <Box
                minHeight={Sizes.minHeight}
                minWidth={Sizes.minWidth}
                borderRight={1}
                className={classes.classes['styledScroll']}
              >
                <Grid container maxHeight={Sizes.maxHeight}>
                  <Grid onClick={handleClickLib1} item xs={12}>
                    {collectionLevelLibraryData?.length <= 0 ||
                    collectionLevelLibraryData === undefined ? (
                      <ListItem className={classes.classes['noPadding']}>
                        <ListItemButton className={classes.classes['noPadding']}>
                          <ListItemText sx={{ paddingLeft: 1 }} primary="Loading data..." />
                        </ListItemButton>
                      </ListItem>
                    ) : (
                      <>
                        {owner && loggedIn ? (
                          <>
                            <ListItem className={classes.classes['noPadding']}>
                              <ListItemButton
                                className={classes.classes['noPadding']}
                                onClick={() => handleAddLibraryAtCollection()}
                              >
                                <ListItemText
                                  sx={{ width: 'max-content', paddingLeft: 1 }}
                                  primary="+ Add Library"
                                />
                              </ListItemButton>
                            </ListItem>
                          </>
                        ) : (
                          <></>
                        )}

                        {collectionLevelLibraryData?.map((library, index) => (
                          <ListItem className={classes.classes['noPadding']} key={index}>
                            <ListItemButton
                              selected={selectedLibrary === index}
                              onClick={(event) => showCollectionLevelLibraryData(library, event, index)}
                              className={classes.classes['noPadding']}
                            >
                              <ListItemText
                                sx={{ paddingLeft: 1, width: 'max-content' }}
                                primary={library?.Class[1]?.value?.Text}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Collapse>

            <Collapse
              in={openAddLibrary}
              timeout="auto"
              style={{ display: openAddLibrary ? 'block' : 'none' }}
              unmountOnExit
            >
              <Box
                minHeight={Sizes.minHeight}
                borderRight={1}
                className={classes.classes['styledScroll']}
              >
                <Grid item xs={12}>
                  <LibraryForm 
                  updateTokenLibraryData={setTokenLibraryData}
                  currentTokenId={currentTokenId} />
                </Grid>
              </Box>
            </Collapse>
            <Collapse
              in={openLibrarySelectedToken}
              timeout="auto"
              unmountOnExit
              style={{ display: openLibrarySelectedToken ? 'block' : 'none' }}
            >
              <Box
                maxHeight={Sizes.maxHeight}
                minHeight={Sizes.minHeight}
                borderRight={1}
                className={classes.classes['styledScroll']}
              >
                <Grid container minWidth={Sizes.minWidth}>
                  <Grid item xs={12}>
                    <NFTLibrary
                      libDet={libDet}
                      currentTokenId={currentTokenId}
                      loggedIn={loggedIn}
                      owner={owner}
                      updateTokenLibraryData={setTokenLibraryData}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>

            <Collapse
              in={openLibraryCollectionLevel}
              timeout="auto"
              style={{ display: openLibraryCollectionLevel ? 'block' : 'none' }}
              unmountOnExit
            >
              <Box
                minHeight={Sizes.minHeight}
                borderRight={1}
                className={classes.classes['styledScroll']}
              >
                <Grid item xs={12}>
                  <CollectionLibrary
                    loggedIn={loggedIn}
                    library3={library3}
                    owner={owner}
                    currentTokenId={''}
                    updateCollectionLevelLibraryData={setCollectionLevelLibraryData}
                  />
                </Grid>
              </Box>
            </Collapse>

            <Collapse
              in={openAddLibraryCollectionLevel}
              timeout="auto"
              style={{ display: openAddLibraryCollectionLevel ? 'block' : 'none' }}
              unmountOnExit
            >
              <Box
                minHeight={Sizes.minHeight}
                borderRight={1}
                className={classes.classes['styledScroll']}
              >
                <Grid item xs={12}>
                  <LibraryForm
                    loggedIn={loggedIn}
                    currentTokenId={''}
                  />
                </Grid>
              </Box>
            </Collapse>
          </List>
        </Grid>
      </Container>
    </div>
  );
};

export default ColumnView;
