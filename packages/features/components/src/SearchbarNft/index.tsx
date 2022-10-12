import React, { useContext, useEffect } from 'react';
import { AuthContext, getTokenId } from '@dapp/features-authentication';
import { Box, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import { collectionName } from '@dapp/utils';
import { getNftCollection, OrigynClient, getNft } from '@origyn-sa/mintjs';
// Preloader
import { CircularProgress } from '@mui/material';

export const SearchbarNft = (props: any) => {
  const { tokenId, actor,canisterId } = useContext(AuthContext);
  const [selectTokenIds, setSelectTokenIds] = React.useState(['']);
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
    const response = await getNftCollection();
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
        const curTokenId=await getTokenId();
        window.location.href = window.location.href.replace(`/${curTokenId}/`, `/${obj_token_ids[0][0]}/`);
      }

    }
  };
  // if the actor changes getNftCollection is called
  useEffect(() => {
    if (actor) {
      OrigynClient.getInstance().init(canisterId);
      NFTCollection();
    }
  }, [actor]);

  return (
    <Box
      component={Paper}
      elevation={2}
      sx={{ margin: 2, width: '100%', padding: 2 }}
    >
      {props.isLoading ? (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <FormControl sx={{ m: 1, width: '100%' }}>
          {tokenId == "" ? (
            <div>
              <Typography
                sx={{
                  m: 1,
                  width: '95%',
                }}
              >
                Collection name: <b>{collectionName(tokenId)}</b>
              </Typography>
              <Typography
                sx={{
                  m: 1,
                  borderBottom: '1px solid',
                  paddingBottom: 2,
                  width: '95%',
                }}
              >
                Current Token ID: <b>{props.searchBarTokenId}</b>
              </Typography>
            </div>
          ) : (
            <Typography
              sx={{
                m: 1,
                borderBottom: '1px solid',
                paddingBottom: 2,
                width: '95%',
              }}
            >
              Current Token ID: <b>{props.searchBarTokenId}</b>
            </Typography>
          )}
          <Typography sx={{ m: 1, fontSize: 13 }}>
            Search for other NFT&#39;S <em>(+{idsNumber}...)</em>
          </Typography>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={selectTokenIds}
            sx={{ width: '95%', m: 1 }}
            renderInput={(params) => (
              <TextField {...params} label="Other tokens IDS" />
            )}
            value={props.searchBarTokenId}
            onChange={(event, newValue) => {
              handleSelectIds(event, newValue);
            }}
          />
        </FormControl>
      )}
    </Box>
  );
};
