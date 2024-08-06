import React, { useContext, useEffect } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { collectionName } from '@dapp/utils';
import { getNftCollectionMeta, OrigynClient } from '@origyn/mintjs';
import {
  Container,
  Card,
  Select,
  HR,
  Grid,
  Icons,
  Flex,
  Button,
  TextInput,
} from '@origyn/origyn-art-ui';
import { PerpetualOSContext } from '@dapp/features-context-provider';

export const SearchbarNft = (props: any) => {
  const context = useContext(PerpetualOSContext);
  const { actor } = useContext(AuthContext);
  const [selectTokenIds, setSelectTokenIds] = React.useState<any>(['']);

  // TODO: uncomment when idsNumber is being used
  // const [idsNumber, setIdsNumber] = React.useState('');

  const [openSearch, setOpenSearch] = React.useState(false);

  const handleSelectIds = (option) => {
    // setSearchBarTokenId state
    if (option.value == null) {
      option.value = props.searchBarTokenId;
    }
    props.setSearchBarTokenId(option.value);
    // replace the tokenId in the searchBar
    window.history.pushState(
      '',
      '',
      window.location.href.replace(`${props.searchBarTokenId}`, `${option.value}`),
    );
  };

  const NFTCollection = async () => {
    setSelectTokenIds(['Loading...']);
    await OrigynClient.getInstance().init(!context.isLocal, context.canisterId, { actor });
    const response = await getNftCollectionMeta();
    if (response.ok) {
      const collectionNFT = response.ok;
      const obj_token_ids = collectionNFT.token_ids;
      // TODO: uncomment when idsNumber is being used
      // const number_ids = collectionNFT.token_ids_count[0].toString();
      // setIdsNumber(number_ids);
      const arrayTokenIds: string[][] = [];
      for (var x in obj_token_ids) {
        var newID = obj_token_ids[x];
        // This is the array created to be filtered with Intersection
        arrayTokenIds.push(newID);
        setSelectTokenIds([...newID]);
      }

      // Check if the token Id is in the url
      const splitted_url: string[] = window.location.href.split('/');
      // Empty indexID
      props.setIndexID('');
      // Check for indexID in url
      const urlParams = new URLSearchParams(window.location.search);
      for (const [key, value] of urlParams) {
        if (key == 'indexID') {
          props.setIndexID(value);
        }
        break;
      }

      // If an item of splitted array is present in the array of Token Ids
      // we have token id in url
      const intersection = splitted_url.filter((e) => arrayTokenIds[0].indexOf(e) > -1);
      if (intersection.length > 0) {
        // setSearchBarTokenId state
        if (context.tokenId) {
          props.setSearchBarTokenId(context.tokenId);
        }
      } else {
        if (window.location.href.includes('collection') && obj_token_ids[0]) {
          props.setSearchBarTokenId(obj_token_ids[0][0]);
        } else {
          // setSearchBarTokenId state
          props.setInvalidToken(true);
        }
      }
    }
  };
  useEffect(() => {
    if (context.canisterId) {
      NFTCollection();
    }
  }, [context, actor]);
  return (
    <>
      <>
        <Container padding="16px">
          {props.isLoading ? (
            <Card type="filled" align="center">
              Loading...
            </Card>
          ) : (
            <Container>
              <>
                <Grid columns={3}>
                  <Grid columns={1}>
                    {!context.tokenId && (
                      <Container padding="16px">
                        Collection name: <b>{collectionName()}</b>
                      </Container>
                    )}
                    <Container padding="16px">
                      Current Token ID: <b>{props.searchBarTokenId}</b>
                    </Container>
                  </Grid>
                </Grid>
                <br />
                <HR />
              </>
              <Container padding="16px">Search for NFTs</Container>
              <Container padding="16px">
                <Grid columns={4}>
                  <Grid columns={1}>
                    <Flex flexFlow="row" align="center" gap={8}>
                      <Button iconButton onClick={() => setOpenSearch(!openSearch)}>
                        <Icons.SearchIcon width={18} height={18} />
                      </Button>
                      {openSearch && (
                        <TextInput
                          onChange={(text) => {
                            handleSelectIds(text.target.value);
                          }}
                        />
                      )}
                      <Select
                        placeholder="Token Ids"
                        selectedOption={props.searchBarTokenId}
                        handleChange={(opt) => {
                          handleSelectIds(opt);
                        }}
                        options={selectTokenIds.map((token) => {
                          return {
                            value: token,
                            label: token,
                          };
                        })}
                      />
                    </Flex>
                  </Grid>
                </Grid>
              </Container>
            </Container>
          )}
        </Container>
      </>
    </>
  );
};
