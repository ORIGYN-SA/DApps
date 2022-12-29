import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { getNft, OrigynClient, getNftCollectionMeta } from '@origyn-sa/mintjs';
import { checkOwner } from '@dapp/utils';
// Library components
import { CollectionLibrary } from '../CollectionLibrary';
import { NFTLibrary } from '../NFTLibrary';
import { LibraryForm } from '../AddLibrary';
import { Container, Grid, Flex, Modal, theme} from '@origyn-sa/origyn-art-ui';
interface ListType {
  itemName: string;
  index: number;
  selectedIndex: number;
  onClick: (event: any) => Promise<void>;
}
const listStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  TextAlign: 'left',
  padding:'0px',
  fontWeight: 'normal',
};

const ListItem = (props: ListType) => {
  return (
    <Container full padding="4px"
      style={
        props.selectedIndex == props.index
         ? { backgroundColor: theme.colors.ACCENT_COLOR } : { backgroundColor: 'transparent' }
      }
    >
      <div
        style={
          props.selectedIndex == props.index
            ? { ...listStyle, fontWeight: 'bold', color: theme.colors.TEXT}
            : listStyle
        }
        onClick={props.onClick}
      >
       {props.itemName}
       </div>
    </Container>
  );
};

const ColumnView = () => {
  const { actor, loggedIn, principal } = useContext(AuthContext);

  const [canisterId, setCanisterId] = useState('');

  // Modal add library
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [openCollection, setOpenCollection] = React.useState(false);
  const handleCloseCollection = () => {
    setOpenCollection(false);
  };

  const [collectionNft, setCollectionNft] = useState([]);
  const [owner, setOwner] = React.useState<boolean>(false);
  const [currentTokenId, setCurrentTokenId] = useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [selectedNft, setSelectedNft] = React.useState(0);
  const [selectedMeta, setSelectedMeta] = React.useState(0);
  const [selectedLibrary, setSelectedLibrary] = React.useState(0);
  const [openCollectionLevel, setOpenCollectionLevel] = React.useState(false);
  const [openLib, setOpenLib] = React.useState(false);
  // Collection level Libraries -- tokenId empty
  const [collectionLevelLibraryData, setCollectionLevelLibraryData] = useState<Array<any>>([]);
  // Specific library -- tokenId from URL or from clicked item
  const [tokenLibraryData, setTokenLibraryData] = useState<Array<any>>([]);
  const [openAddLibrary, setOpenAddLibrary] = React.useState(false);
  const [openLibrarySelectedToken, setOpenLibrarySelectedToken] = useState(false);
  const [openLibraryCollectionLevel, setOpenLibraryCollectionLevel] = useState(false);
  const [libDet, setLibDet] = useState('');
  const [library3, setLibrary3] = useState();
  const [openAddLibraryCollectionLevel, setOpenAddLibraryCollectionLevel] = React.useState(false);

  const handleClickOnNfts = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    // Set collection level libraries data to empty
    setCollectionLevelLibraryData([]);
    setOpenCollectionLevel(!openCollectionLevel);
    setOpenLib(false);
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
    setLibDet('');
    const { canisterId } = await useRoute();
    setOpenLib(false);
    setOpenLibrarySelectedToken(false);
    setOpenAddLibrary(false);
    handleDetails();
    setSelectedNft(index);
    setSelectedMeta(null);
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

  const handleClickOnCollectionLevel = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    //Set coll. nft to empty
    setCollectionNft([]);
    setCurrentTokenId('');
    setOpenLib(!openLib);
    setOpenCollectionLevel(false);
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

  const handleDetails = () => {
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

  const showCollectionLevelLibraryData = async (
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
    setOpenLibraryCollectionLevel(false);
    setOpenLibrarySelectedToken(false);
    setOpen(true);
  };

  const handleAddLibraryAtCollection = async () => {
    setCurrentTokenId;
    setOpenAddLibraryCollectionLevel(!openAddLibraryCollectionLevel);
    setOpenLib(false);
    setOpenLibraryCollectionLevel(false);
    setOpenLibrarySelectedToken(false);
    setOpenCollection(true);
  };

  const openSpecificNft = async () => {
    const { tokenId, canisterId } = await useRoute();
    if (tokenId !== '') {
      setOpenCollectionLevel(!openCollectionLevel);
      setOpenLib(false);
      setOpenLibraryCollectionLevel(false);
      setOpenLibrarySelectedToken(false);
      setOpenAddLibrary(false);
      await nftCollection();
      handleDetails();
      OrigynClient.getInstance().init(true, canisterId);
      setCurrentTokenId(tokenId);
      setSelectedIndex(0);
      setSelectedMeta(null);
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
    const { canisterId } = await useRoute();
    const checked = await checkOwner(principal, canisterId);
    setOwner(checked);
  };

  useEffect(() => {
    if (loggedIn) {
      checkAndSetOwner();
    }
  }, [canisterId]);

  return (
    <>
      <Container padding="16px">
        <Grid columns={6}>
          <Grid column={1} style={{ borderRight: '1px solid grey' }}>
            <Flex flexFlow="column" align="flex-start" justify="flex-start" gap={16}>
              <ListItem
                itemName={'NFTs'}
                onClick={(event) => handleClickOnNfts(event, 0)}
                index={0}
                selectedIndex={selectedIndex}
              />
              <ListItem
                itemName={'Collection'}
                onClick={(event) => handleClickOnCollectionLevel(event, 1)}
                index={1}
                selectedIndex={selectedIndex}
              />
            </Flex>
          </Grid>
          {collectionNft.length > 0 ? (
            <>
              <Grid column={2} style={{ borderRight: '1px solid grey' }}>
                <Flex flexFlow="column" align="flex-start" justify="flex-start" gap={16}>
                  {collectionNft?.map((nft, index) => (
                    <ListItem
                      itemName={nft}
                      onClick={(event) => handleClickOnSelectedNft(nft, event, index)}
                      index={index}
                      selectedIndex={selectedNft}
                    />
                  ))}
                </Flex>
              </Grid>
              <Grid column={3} style={{ borderRight: '1px solid grey' }}>
                {currentTokenId ? (
                  <Flex flexFlow="column" align="flex-start" justify="flex-start" gap={16}>
                    {owner && loggedIn ? (
                      <>
                        <Flex onClick={() => handleAddLibrary()}>
                          <span>
                            <b> + Add a library</b>
                          </span>
                        </Flex>
                      </>
                    ) : (
                      <></>
                    )}
                    {tokenLibraryData?.map((library, index) => (
                      <ListItem
                        itemName={library?.Class[1]?.value?.Text}
                        onClick={(event) => handleDeta(library, event, index)}
                        index={index}
                        selectedIndex={selectedMeta}
                      />
                    ))}
                  </Flex>
                ) : (
                  <>
                    <Flex>Select Token</Flex>
                  </>
                )}
              </Grid>
              <Grid column={4} style={{ borderRight: '1px solid grey', gridColumnEnd: 'span 3' }}>
                {libDet ? (
                  <NFTLibrary
                    libDet={libDet}
                    currentTokenId={currentTokenId}
                    loggedIn={loggedIn}
                    owner={owner}
                    updateTokenLibraryData={setTokenLibraryData}
                    setOpenLibrarySelectedToken={setOpenLibrarySelectedToken}
                    setLibDet={setLibDet}
                  />
                ) : (
                  <></>
                )}
              </Grid>
              <Grid column={5}></Grid>
              <Grid column={6}></Grid>
            </>
          ) : (
            <>
              <Grid column={2} style={{ borderRight: '1px solid grey' }}>
                <Flex flexFlow="column" align="flex-start" justify="flex-start" gap={16}>
                  {owner && loggedIn && collectionLevelLibraryData.length > 0 ? (
                    <>
                      <Flex onClick={() => handleAddLibraryAtCollection()}>
                        <span>
                          <b>+ Add a library at collection level</b>
                        </span>
                      </Flex>
                    </>
                  ) : (
                    <></>
                  )}
                  <Flex flexFlow="column" align="flex-start" justify="flex-start" gap={16}>
                    {collectionLevelLibraryData?.map((library, index) => (
                      <ListItem
                        itemName={library?.Class[1]?.value?.Text}
                        onClick={(event) => showCollectionLevelLibraryData(library, event, index)}
                        index={index}
                        selectedIndex={selectedLibrary}
                      />
                    ))}
                  </Flex>
                </Flex>
              </Grid>
              <Grid column={3} style={{ borderRight: '1px solid grey', gridColumnEnd: 'span 4' }}>
                {library3 ? (
                  <CollectionLibrary
                    loggedIn={loggedIn}
                    library3={library3}
                    owner={owner}
                    currentTokenId={''}
                    setOpenLibraryCollectionLevel={setOpenLibraryCollectionLevel}
                    updateCollectionLevelLibraryData={setCollectionLevelLibraryData}
                    setLibrary3={setLibrary3}
                  />
                ) : (
                  <></>
                )}
              </Grid>
              <Grid column={4}></Grid>
              <Grid column={5}></Grid>
              <Grid column={6}></Grid>
            </>
          )}
        </Grid>
      </Container>
      <>
        <Modal closeModal={handleClose} isOpened={open} mode="light" size="md">
          <Container padding="16px">
            <LibraryForm
              updateDataToken={setTokenLibraryData}
              currentTokenId={currentTokenId}
              setOpen={setOpen}
            />
          </Container>
        </Modal>
      </>
      <>
        <Modal closeModal={handleCloseCollection} isOpened={openCollection} mode="light" size="md">
          <Container padding="16px">
            <LibraryForm
              updateDataCollection={setCollectionLevelLibraryData}
              currentTokenId={currentTokenId}
              setOpenCollection={setOpenCollection}
            />
          </Container>
        </Modal>
      </>
    </>
  );
};

export default ColumnView;
