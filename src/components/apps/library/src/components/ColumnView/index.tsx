import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@dapp/features-authentication";
import { PerpetualOSContext } from "@dapp/features-context-provider";
import { getNft, OrigynClient, getNftCollectionMeta } from "@origyn/mintjs";
import { checkOwner } from "@dapp/utils";
// Library components
import { CollectionLibrary } from "../CollectionLibrary";
import { NFTLibrary } from "../NFTLibrary";
import { LibraryForm } from "../AddLibrary";
import { Container, Grid, Flex, Modal, theme } from "@origyn/origyn-art-ui";

function replaceSelectedTokenInTheUrl(selectedToken: string, tokenId: string) {
  if (tokenId) {
    const newUrl = window.location.href.replace(tokenId, selectedToken);
    window.history.pushState({ path: newUrl }, "", newUrl);
  }
}

interface ListType {
  itemName: string;
  index: number;
  selectedIndex: number | null;
  onClick: (event: any) => Promise<void>;
}
const listStyle = {
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  TextAlign: "left",
  padding: "0px",
  fontWeight: "normal",
};

const ListItem = (props: ListType) => {
  return (
    <Container
      size="full"
      padding="4px"
      style={
        props.selectedIndex == props.index
          ? { backgroundColor: theme.colors.ACCENT_COLOR }
          : { backgroundColor: "transparent" }
      }
    >
      <div
        style={
          props.selectedIndex == props.index
            ? {
                ...listStyle,
                fontWeight: "bold",
                color: theme.colors.TEXT,
                cursor: "pointer",
              }
            : listStyle
        }
        onClick={props.onClick}
      >
        {props.itemName?.length > 24
          ? props.itemName.substring(0, 24) + "..."
          : props.itemName}
      </div>
    </Container>
  );
};

const ColumnView = () => {
  const context = useContext(PerpetualOSContext);
  const { actor, loggedIn, principal } = useContext(AuthContext);

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
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [selectedNft, setSelectedNft] = React.useState<number | null>(null);
  const [selectedMeta, setSelectedMeta] = React.useState<number | null>(null);
  const [selectedLibrary, setSelectedLibrary] = React.useState<number | null>(null);
  const [openCollectionLevel, setOpenCollectionLevel] = React.useState(false);
  const [openLib, setOpenLib] = React.useState(false);
  // Collection level Libraries -- tokenId empty
  const [collectionLevelLibraryData, setCollectionLevelLibraryData] = useState<
    Array<any>
  >([]);
  // Specific library -- tokenId from URL or from clicked item
  const [tokenLibraryData, setTokenLibraryData] = useState<Array<any>>([]);
  const [openAddLibrary, setOpenAddLibrary] = React.useState(false);
  const [openLibrarySelectedToken, setOpenLibrarySelectedToken] =
    useState(false);
  const [openLibraryCollectionLevel, setOpenLibraryCollectionLevel] =
    useState(false);
  const [tokenLevelLibraryMetadata, setTokenLevelLibraryMetadata] =
    useState("");
  const [collectionLevelLibraryMetadata, setCollectionLevelLibraryMetadata] =
    useState();
  const [openAddLibraryCollectionLevel, setOpenAddLibraryCollectionLevel] =
    React.useState(false);

  const handleClickOnNfts = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
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
    index: number
  ) => {
    setTokenLevelLibraryMetadata("");
    setOpenLib(false);
    setOpenLibrarySelectedToken(false);
    setOpenAddLibrary(false);
    handleDetails();
    setSelectedNft(index);
    setSelectedMeta(null);
    replaceSelectedTokenInTheUrl(nft, context.tokenId);
    await OrigynClient.getInstance().init(
      !context.isLocal,
      context.canisterId,
      { actor }
    );
    getNft(nft).then((r) => {
      if (r.ok && r.ok.metadata && "Class" in r.ok.metadata) {
        const libraryClass = r.ok.metadata.Class.find(
          (res) => res.name === "library"
        );
        if (libraryClass && libraryClass.value) {
          setTokenLibraryData(libraryClass.value["Array"]);
        }
      }
    });
  };

  const handleClickOnCollectionLevel = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    //Set coll. nft to empty
    setCollectionNft([]);
    setOpenLib(!openLib);
    setOpenCollectionLevel(false);
    setOpenLibrarySelectedToken(false);
    setOpenLibraryCollectionLevel(false);
    setOpenAddLibrary(false);
    setOpenAddLibraryCollectionLevel(false);
    setSelectedIndex(index);
    // Collection level libraries the tokenId is empty
    if (actor) {
      await OrigynClient.getInstance().init(
        !context.isLocal,
        context.canisterId,
        { actor }
      );
      getNftCollectionMeta().then((r) => {
        if (r.ok && r.ok.metadata && Array.isArray(r.ok.metadata)) {
          const firstMetadata = r.ok.metadata[0];
          if (firstMetadata && firstMetadata["Class"]) {
            const libraryClass = firstMetadata["Class"].find(
              (res) => res.name === "library"
            );
            if (
              libraryClass &&
              libraryClass.value &&
              libraryClass.value.Array
            ) {
              setCollectionLevelLibraryData(libraryClass.value.Array);
            }
          }
        }
      });
    }
  };

  const handleDetails = () => {
    setOpenLibrarySelectedToken(false);
    setOpenAddLibrary(false);
  };

  const handleDeta = async (lib, index: number) => {
    setOpenLibrarySelectedToken(true);
    setTokenLevelLibraryMetadata(lib);
    setSelectedMeta(index);
    setOpenAddLibrary(false);
  };

  const showCollectionLevelLibraryData = async (lib3, index: number) => {
    setCollectionLevelLibraryMetadata(lib3);
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
    setOpenAddLibraryCollectionLevel(!openAddLibraryCollectionLevel);
    setOpenLib(false);
    setOpenLibraryCollectionLevel(false);
    setOpenLibrarySelectedToken(false);
    setOpenCollection(true);
  };

  const openSpecificNft = async () => {
    if (context.tokenId) {
      setOpenCollectionLevel(!openCollectionLevel);
      setOpenLib(false);
      setOpenLibraryCollectionLevel(false);
      setOpenLibrarySelectedToken(false);
      setOpenAddLibrary(false);
      await nftCollection();
      handleDetails();
      await OrigynClient.getInstance().init(
        !context.isLocal,
        context.canisterId,
        { actor }
      );
      setSelectedIndex(0);
      setSelectedMeta(null);
      setSelectedNft((await nftCollection()).indexOf(context.tokenId));
      getNft(context.tokenId).then((r) => {
        if (r.ok && "Class" in r.ok.metadata) {
          const libraryArray: any[] = r.ok.metadata.Class.filter((res) => {
            return res.name === "library";
          })[0]?.value?.['Array'] || [];
          
          setTokenLibraryData(libraryArray || []);
        }
      });
    }
  };

  // Auto refresh after Token Level Library Update
  useEffect(() => {
  if(selectedMeta){
    handleDeta(tokenLibraryData[selectedMeta], selectedMeta);}
  }, [tokenLibraryData]);
  // Auto refresh after Collection Level Library Update
  useEffect(() => {
    if(selectedLibrary){
    showCollectionLevelLibraryData(
      collectionLevelLibraryData[selectedLibrary],
      selectedLibrary
    );}
  }, [collectionLevelLibraryData]);

  const nftCollection = async () => {
    setCollectionNft([]);
    await OrigynClient.getInstance().init(
      !context.isLocal,
      context.canisterId,
      { actor }
    );
    const response = await getNftCollectionMeta();
    const collectionNFT = response.ok;
    const tokenIds: any = collectionNFT?.token_ids[0];
    setCollectionNft(tokenIds);
    // In case we have URL with tokenID and we change canister,
    // We need to check if the tokenID is in the new canister
    // If not, we need to clear the URL and show the first tokenID in the new Canister
    if (!tokenIds.includes(context.tokenId) && context.tokenId !== "") {
      let Url = window.location.href;
      Url = Url.replace(context.tokenId, tokenIds[0]);
      window.location.href = Url;
    }
    return tokenIds;
  };

  // If tokenID is in the URL, open the library of the specific tokenID
  useEffect(() => {
    openSpecificNft();
  }, []);

  const checkAndSetOwner = async () => {
    if(principal){
    const checked = await checkOwner(
      principal,
      context.canisterId,
      !context.isLocal
    );
    
    setOwner(checked);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      checkAndSetOwner();
    }
  }, [context]);

  useEffect(() => {
    // TODO: Handle Event
    // console.log('openLibrarySelectedToken', openLibrarySelectedToken);
    // console.log('openLibraryCollectionLevel', openLibraryCollectionLevel);
  }, [openLibrarySelectedToken, openLibraryCollectionLevel]);

  return (
    <>
      <Container padding="16px">
        <Grid columns={6}>
          <Grid columns={1} style={{ borderRight: "1px solid grey" }}>
            <Flex
              flexFlow="column"
              align="flex-start"
              justify="flex-start"
              gap={16}
            >
              <ListItem
                itemName={"NFTs"}
                onClick={(event) => handleClickOnNfts(event, 0)}
                index={0}
                selectedIndex={selectedIndex}
              />
              <ListItem
                itemName={"Collection"}
                onClick={(event) => handleClickOnCollectionLevel(event, 1)}
                index={1}
                selectedIndex={selectedIndex}
              />
            </Flex>
          </Grid>
          {collectionNft?.length > 0 ? (
            <>
              <Grid columns={2} style={{ borderRight: "1px solid grey" }}>
                <Flex
                  flexFlow="column"
                  align="flex-start"
                  justify="flex-start"
                  gap={16}
                >
                  {collectionNft?.map((nft, index) => (
                    <ListItem
                      key={index}
                      itemName={nft}
                      onClick={(event) =>
                        handleClickOnSelectedNft(nft, event, index)
                      }
                      index={index}
                      selectedIndex={selectedNft}
                    />
                  ))}
                </Flex>
              </Grid>
              <Grid columns={3} style={{ borderRight: "1px solid grey" }}>
                <Flex
                  flexFlow="column"
                  align="flex-start"
                  justify="flex-start"
                  gap={16}
                >
                  {owner && loggedIn && (
                    <>
                      <Flex onClick={() => handleAddLibrary()}>
                        <Container padding="4px" style={{ cursor: "pointer" }}>
                          <b> + Add a library</b>
                        </Container>
                      </Flex>
                    </>
                  )}
                  {tokenLibraryData.length > 0 ? (
                    tokenLibraryData.map((library, index) => (
                      <ListItem
                        key={index}
                        itemName={library?.Class[1]?.value?.Text}
                        onClick={() => handleDeta(library, index)}
                        index={index}
                        selectedIndex={selectedMeta}
                      />
                    ))
                  ) : (
                    <>
                      <Flex>Select a token</Flex>
                    </>
                  )}
                </Flex>
              </Grid>
              <Grid
                columns={4}
                style={{
                  borderRight: "1px solid grey",
                  gridColumnEnd: "span 3",
                }}
              >
                {tokenLevelLibraryMetadata ? (
                  <NFTLibrary
                    tokenLevelLibraryMetadata={tokenLevelLibraryMetadata}
                    currentTokenId={context.tokenId}
                    loggedIn={loggedIn}
                    owner={owner}
                    updateTokenLibraryData={setTokenLibraryData}
                    setOpenLibrarySelectedToken={setOpenLibrarySelectedToken}
                    setTokenLevelLibraryMetadata={setTokenLevelLibraryMetadata}
                  />
                ) : (
                  <></>
                )}
              </Grid>
              <Grid columns={5}></Grid>
              <Grid columns={6}></Grid>
            </>
          ) : (
            <>
              <Grid columns={2} style={{ borderRight: "1px solid grey" }}>
                <Flex
                  flexFlow="column"
                  align="flex-start"
                  justify="flex-start"
                  gap={16}
                >
                  {owner &&
                  loggedIn &&
                  collectionLevelLibraryData.length > 0 ? (
                    <>
                      <Flex onClick={() => handleAddLibraryAtCollection()}>
                        <Container padding="4px" style={{ cursor: "pointer" }}>
                          <b>+ Add a library at collection level</b>
                        </Container>
                      </Flex>
                    </>
                  ) : (
                    <></>
                  )}
                  <Flex
                    flexFlow="column"
                    align="flex-start"
                    justify="flex-start"
                    gap={16}
                  >
                    {collectionLevelLibraryData?.map((library, index) => (
                      <ListItem
                        key={index}
                        itemName={library?.Class[1]?.value?.Text}
                        onClick={() =>
                          showCollectionLevelLibraryData(library, index)
                        }
                        index={index}
                        selectedIndex={selectedLibrary}
                      />
                    ))}
                  </Flex>
                </Flex>
              </Grid>
              <Grid
                columns={3}
                style={{
                  borderRight: "1px solid grey",
                  gridColumnEnd: "span 4",
                }}
              >
                {collectionLevelLibraryMetadata ? (
                  <CollectionLibrary
                    loggedIn={loggedIn}
                    collectionLevelLibraryMetadata={
                      collectionLevelLibraryMetadata
                    }
                    owner={owner}
                    currentTokenId={""}
                    setOpenLibraryCollectionLevel={
                      setOpenLibraryCollectionLevel
                    }
                    updateCollectionLevelLibraryData={
                      setCollectionLevelLibraryData
                    }
                    setCollectionLevelLibraryMetadata={
                      setCollectionLevelLibraryMetadata
                    }
                  />
                ) : (
                  <></>
                )}
              </Grid>
              <Grid columns={4}></Grid>
              <Grid columns={5}></Grid>
              <Grid columns={6}></Grid>
            </>
          )}
        </Grid>
      </Container>
      <>
        <Modal closeModal={handleClose} isOpened={open} mode="light" size="md">
          <Container padding="16px">
            <LibraryForm
              updateDataToken={setTokenLibraryData}
              currentTokenId={context.tokenId}
              setOpen={setOpen}
            />
          </Container>
        </Modal>
      </>
      <>
        <Modal
          closeModal={handleCloseCollection}
          isOpened={openCollection}
          mode="light"
          size="md"
        >
          <Container padding="16px">
            <LibraryForm
              updateDataCollection={setCollectionLevelLibraryData}
              currentTokenId={context.tokenId}
              setOpenCollection={setOpenCollection}
            />
          </Container>
        </Modal>
      </>
    </>
  );
};

export default ColumnView;
