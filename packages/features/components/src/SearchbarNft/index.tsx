import React, { useContext, useEffect } from 'react';
import { AuthContext, getTokenId } from '@dapp/features-authentication';
import { collectionName } from '@dapp/utils';
import { getNftCollectionMeta, OrigynClient, getNft } from '@origyn-sa/mintjs';
import { Container, Card, Select } from '@origyn-sa/origyn-art-ui';

interface SelectType {
  value: string;
  label: string;
}

const ISPROD = true;
export const SearchbarNft = (props: any) => {

  const { tokenId, actor,canisterId } = useContext(AuthContext);
  const [selectTokenIds, setSelectTokenIds] = React.useState<any>(['']);
  const [selectUi, setSelectUi] = React.useState<SelectType[]>([]);
  const [idsNumber, setIdsNumber] = React.useState('');
  const handleSelectIds = (event, value) => {
    // setSearchBarTokenId state
    if (value == null) {
      value = '';
    }
    props.setSearchBarTokenId(value);
    // replace the tokenId in the searchBar
    window.history.pushState(
      '',
      '',
      window.location.href.replace(`/${props.searchBarTokenId}/`, `/${value}/`),
    );
  };

  const NFTobj = async () => {
    const nft = await getNft(tokenId);
    console.log('nft', nft);
  };

  useEffect(() => {
    NFTobj();
  }, []);
  const NFTCollection = async () => {
    setSelectTokenIds(['Loading...']);
    const response = await getNftCollectionMeta();
    console.log(response);
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
      useRoute().then(({ canisterId }) => {
        OrigynClient.getInstance().init(ISPROD,canisterId);
        NFTCollection();
      });
    }
  }, [actor]);

  useEffect(() => {
    useRoute().then(({ tokenId }) => {
      setTokenId(tokenId);
    });
  }, []);

  return (
    <Container padding="16px">
      {props.isLoading ? (
        <Card 
        type="filled"
        align="center"
      >
          Loading...
        </Card>
      ) : (
        <Container>
          {tokenId == "" ? (
            <>
              <Container padding="16px">
                Collection name: <b>{collectionName(tokenId)}</b>
              </Container>
              <Container padding="16px">
                Current Token ID: <b>{props.searchBarTokenId}</b>
              </Container>
            </>
          ) : (
            <Container padding="16px">
              Current Token ID: <b>{props.searchBarTokenId}</b>
            </Container>
          )}
          <Container padding="16px" >
            Search for other NFT&#39;S <em>(+{idsNumber}...)</em>
          </Container>
          <Container padding="16px">
            <Select 
             placeholder="Token Ids"
             selectedOption={props.searchBarTokenId}
             handleChange={(event) => {
               handleSelectIds(event, event.target.value);
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
          </Container>
        </Container>
      )}
    </Container>
  );
};
