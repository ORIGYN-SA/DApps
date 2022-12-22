import React, { useContext, useEffect } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { collectionName } from '@dapp/utils';
import { getNftCollectionMeta, OrigynClient, getNft } from '@origyn-sa/mintjs';
import { Container, Card, Select, HR, Grid, Icons, Flex, Button, TextInput } from '@origyn-sa/origyn-art-ui';
import styled from 'styled-components'

interface SelectType {
  value: string;
  label: string;
}

const ISPROD = true;

export const SearchbarNft = (props: any) => {
  const { actor } = useContext(AuthContext);
  const [tokenId, setTokenId] = React.useState('');
  const [canisterId, setCanisterId] = React.useState('');
  const [selectTokenIds, setSelectTokenIds] = React.useState<any>(['']);
  const [idsNumber, setIdsNumber] = React.useState('');
  const [openSearch, setOpenSearch] = React.useState(false);
  const handleSelectIds = (option) => {
    // setSearchBarTokenId state
    if (option.value == null) {
      option.value = '';
    }
    props.setSearchBarTokenId(option.value);
    // replace the tokenId in the searchBar
    window.history.pushState(
      '',
      '',
      window.location.href.replace(`/${props.searchBarTokenId}/`, `/${option.value}/`),
    );
  };

  const NFTobj = async () => {
    const nft = await getNft(tokenId);
    console.log('nft', nft);
  };

  const GetTokenId = async () => {
    setTokenId(await useRoute().then((res) => res.tokenId));
  };
  const GetCanisterId = async () => {
    setCanisterId(await useRoute().then((res) => res.canisterId));
  };

  useEffect(() => {
    NFTobj();
    GetTokenId();
    GetCanisterId();
  }, []);
  const NFTCollection = async () => {
    setSelectTokenIds(['Loading...']);
    const response = await getNftCollectionMeta();
    const collectionNFT = response.ok;
    const obj_token_ids = collectionNFT.token_ids;
    const number_ids = collectionNFT.token_ids_count[0].toString();
    setIdsNumber(number_ids);
    const arrayTokenIds = [];
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
      props.setSearchBarTokenId(tokenId);
    } else {
      if (window.location.href.search('collection')!=-1) {
        props.setSearchBarTokenId(obj_token_ids[0][0]);
      } else {
        // setSearchBarTokenId state
        props.setSearchBarTokenId(obj_token_ids[0][0]);
        window.location.href = window.location.href.replace(`/${tokenId}/`, `/${obj_token_ids[0][0]}/`);
      }

    }
  };
  // if the actor changes getNftCollection is called
  useEffect(() => {
    if (actor) {
      OrigynClient.getInstance().init(ISPROD,canisterId);
      NFTCollection();
    }
  }, [actor]);
  return (
    <Container padding="16px">
      {props.isLoading ? (
        <Card 
        type="filled"
        align="center"
        padding="16px"
      >
          Loading...
        </Card>
      ) : (
        <Container>
          {tokenId == "" ? (
            <>
              <Grid columns={3}>
                <Grid column={1}>
              <Container padding="16px">
                Collection name: <b>{collectionName(tokenId)}</b>
              </Container>
              <Container padding="16px">
                Current Token ID: <b>{props.searchBarTokenId}</b>
              </Container>
              </Grid>
              </Grid>
              <br/>
              <HR/>
            </>
          ) : (
            <Container padding="16px">
            <Grid columns={3}>
            <Grid column={1}>
              Current Token ID: <b>{props.searchBarTokenId}</b>
              </Grid>
              </Grid>
              <br/>
              <br/>
              <HR/>
            </Container>            
          )}
          <Container padding="16px" >
            Search for NFTs
          </Container>
          <Container padding="16px">
          <Grid columns={4}>           
            <Grid column={1}>
            <Flex flexFlow='row' align='center' gap={8}>
              <Button iconButton onClick={()=>setOpenSearch(!openSearch)}> 
            <Icons.SearchIcon width={18} height={18}/>
            </Button>
            {openSearch && <TextInput onChange={(text) => {
              handleSelectIds(text.target.value);
            }}/>}
            <Select 
             placeholder="Token Ids"
             selectedOption={props.searchBarTokenId}
            handleChange={(opt) => {
              handleSelectIds(opt);
            }}
             options={
              selectTokenIds.map((token) => {
                return {
                  value: token,
                  label: token,
                };
              })
             }
            />
            </Flex>
            </Grid>
            </Grid>
          </Container>
        </Container>
      )}
    </Container>
  );
};
