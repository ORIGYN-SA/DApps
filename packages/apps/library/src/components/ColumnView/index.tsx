import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, getTokenId, getCanisterId } from '@dapp/features-authentication';
import { getNft, OrigynClient, getNftCollectionMeta } from '@origyn-sa/mintjs';
import { checkOwner } from '@dapp/utils';
// Import from style.tsx
import { Sizes, ListItemButton, useStyles } from './style';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';
// Library components
import { LibraryBox } from '../LibraryBox';
import { NFTLibrary } from '../NFTLibrary';
import { LibraryForm } from '../AddLibrary';
import { DeleteLibrary } from '../DeleteLibrary';

const ColumnView = () => {
  const [owner, setOwner] = React.useState<boolean>(false);
  const [currentTokenId, setCurrentTokenId] = useState('');
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
  const [openForm, setOpenForm] = React.useState(false);
  const [openFormDelete, setOpenFormDelete] = React.useState(false);
  const [openDeta, setOpenDeta] = useState(false);
  const [openDub, setOpenDub] = useState(false);
  const [libDet, setLibDet] = useState();
  const [opera, setOpera] = useState(false);
  const classes = useStyles();
  const [library3, setLibrary3] = useState();
  const { actor, canisterId, loggedIn, principal } = useContext(AuthContext);
  const [collectionNft, setCollectionNft] = useState([]);

  const [openFormDefault, setOpenFormDefault] = React.useState(false);

  const currentCanisterId = async () => {
    const canisterId = await getCanisterId();
    return canisterId;
  };
  const currentUrlTokenId = async () => {
    const tokenId = await getTokenId();
    return tokenId;
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setOpen(!open);
    setOpen1(false);
    setOpenLib(false);
    setOpera(false);
    setOpenDetails(false);
    setOpenDub(false);
    setOpenDeta(false);
    setOpenForm(false);
    setOpenFormDefault(false);
    nftCollection();
    setSelectedIndex(index);
  };

  const handleClick1 = async (
    nft,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setOpen1(!open1);
    setOpenLib(false);
    setOpera(false);
    setOpenDetails(false);
    setOpenDeta(false);
    setOpenForm(false);
    handleDetails();
    setSelectedNft(index);
    setCurrentTokenId(nft);
    OrigynClient.getInstance().init(true, await currentCanisterId());
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
    setOpenForm(false);
    setOpenFormDefault(false);
    setSelectedIndex(index);
    // As default-general view of libraries the tokenId is empty
    if (actor) {
      OrigynClient.getInstance().init(true, await currentCanisterId());
      getNftCollectionMeta().then((r) => {
        console.log('CollMeta', r);
        setDefaultLibraryData(
          r.ok.metadata[0].Class.filter((res) => {
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
    setOpenForm(false);
  };

  const handleDetails = () => {
    setOpenDetails(!openDetails);
    setOpenDeta(false);
    setOpenForm(false);
  };

  const handleDeta = async (
    lib,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setOpenDeta(!openDeta);
    setLibDet(lib);
    setSelectedMeta(index);
    setOpenForm(false);
  };

  const handleClick3 = (
    lib3,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setLibrary3(lib3);
    setSelectedLibrary(index);
    setOpenDub(!openDub);
    setOpenForm(false);
    setOpenFormDefault(false);
  };

  const handleForm = () => {
    setOpenForm(!openForm);
    setOpenFormDelete(false);
    setOpenLib(false);
    setOpera(false);
    setOpenDetails(false);
    setOpenDub(false);
    setOpenDeta(false);
  };

  const handleForm1 = () => {
    setOpenFormDefault(!openFormDefault);
    setOpenLib(false);
    setOpera(false);
    setOpenDetails(false);
    setOpenDub(false);
    setOpenDeta(false);
  };

  const openSpecificNft = async () => {
    if (getTokenId() !== '') {
      setOpen(!open);
      setOpenLib(false);
      setOpera(false);
      setOpenDetails(false);
      setOpenDub(false);
      setOpenDeta(false);
      setOpenForm(false);
      await nftCollection();
      setOpen1(!open1);
      handleDetails();

      OrigynClient.getInstance().init(true, await currentCanisterId());
      const curTokenId = await getTokenId();
      setCurrentTokenId(curTokenId);
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
    setCollectionNft([]);
    OrigynClient.getInstance().init(true, await currentCanisterId());
    const response = await getNftCollectionMeta([]);
    console.log('responseCollectionMeta', response);
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
      setCurrentTokenId(obj_token_ids[0]);
    }
    return obj_token_ids;
  };

  // If tokenID is in the URL, open the library of the specific tokenID
  useEffect(() => {
    openSpecificNft();
    console.log('actor', actor);
  }, []);

  const checkAndSetOwner = async () => {
    const checked = await checkOwner(
      principal,
      await currentCanisterId(),
      await currentUrlTokenId(),
    );
    setOwner(checked);
  };

  useEffect(() => {
    if (loggedIn) {
      checkAndSetOwner();
    }
  }, [canisterId, currentTokenId]);

  return (
    <div>
      <Box component={Paper} elevation={2} sx={{ margin: 2, width: '100%', padding: 2 }}>
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
                      onClick={(event) => handleClick(event, 0)}
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
                      onClick={(event) => handleClickLib(event, 1)}
                      className={classes.classes['noPadding']}
                    >
                      <ListItemText sx={{ paddingLeft: 1 }} primary="Collection" />
                    </ListItemButton>
                  </ListItem>
                </Grid>
              </Grid>
            </Box>
            <Collapse in={open} timeout="auto" unmountOnExit>
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
                            onClick={(event) => handleClick1(nft, event, index)}
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
                          onClick={() => handleForm()}
                        >
                          <ListItemText
                            sx={{ width: 'max-content', paddingLeft: 1 , fontWeight: 'bold'}}
                            primary="+ Add a Library"
                          />
                        </ListItemButton>
                      </ListItem>
                      </>
                      
                    ) : (
                      <></>
                    )}
                    {libraryData?.map((library, index) => (
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
                    {defaultLibraryData?.length <= 0 || defaultLibraryData === undefined ? (
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
                              onClick={() => handleForm1()}
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

                        {defaultLibraryData?.map((library, index) => (
                          <ListItem className={classes.classes['noPadding']} key={index}>
                            <ListItemButton
                              selected={selectedLibrary === index}
                              onClick={(event) => handleClick3(library, event, index)}
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
              in={openForm}
              timeout="auto"
              style={{ display: openForm ? 'block' : 'none' }}
              unmountOnExit
            >
              <Box
                minHeight={Sizes.minHeight}
                borderRight={1}
                className={classes.classes['styledScroll']}
              >
                <Grid item xs={12}>
                  <LibraryForm 
                  currentTokenId={currentTokenId} 
                  />
                </Grid>
              </Box>
            </Collapse>

            <Collapse
              in={openFormDelete}
              timeout="auto"
              style={{ display: openFormDelete? 'block' : 'none' }}
              unmountOnExit
            >
              <Box
                minHeight={Sizes.minHeight}
                borderRight={1}
                className={classes.classes['styledScroll']}
              >
                <Grid item xs={12}>
                  <DeleteLibrary currentTokenId={currentTokenId} />
                </Grid>
              </Box>
            </Collapse>

            <Collapse
              in={openDeta}
              timeout="auto"
              unmountOnExit
              style={{ display: openDeta ? 'block' : 'none' }}
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
                    loggedIn = {loggedIn}
                    owner = {owner}
                  />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>

            <Collapse
              in={openDub}
              timeout="auto"
              style={{ display: openDub ? 'block' : 'none' }}
              unmountOnExit
            >
              <Box
                minHeight={Sizes.minHeight}
                borderRight={1}
                className={classes.classes['styledScroll']}
              >
                <Grid item xs={12}>
                  <LibraryBox 
                  loggedIn = {loggedIn}
                  library3={library3} 
                  owner = {owner}
                  currentTokenId={''}
                  />
                </Grid>
              </Box>
            </Collapse>

            <Collapse
              in={openFormDefault}
              timeout="auto"
              style={{ display: openFormDefault ? 'block' : 'none' }}
              unmountOnExit
            >
              <Box
                minHeight={Sizes.minHeight}
                borderRight={1}
                className={classes.classes['styledScroll']}
              >
                <Grid item xs={12}>
                  <LibraryForm 
                  loggedIn = {loggedIn}
                  currentTokenId={''} />
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
