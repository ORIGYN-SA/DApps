import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, getTokenId, getCanisterId } from '@dapp/features-authentication';
import NFTInfo from '../NFTInfo';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { SwitchCanisterCollection, SearchbarNft } from '@dapp/features-components';
import Paper from '@mui/material/Paper';
import { OrigynClient, getNftCollectionMeta} from '@origyn-sa/mintjs';


const currentCanisterId = async () => {
  const canisterId = await getCanisterId();
  return canisterId;
};
const currTokenId = async () => {
  const tokenId = await getTokenId();
  return tokenId;
};

const Home = () => {
  const { tokenId, canisterId, principal, actor } = useContext(AuthContext);
  const [collectionNft, setCollectionNft] = useState([]);
  const [currentTokenId, setCurrentTokenId] = useState('');
  const [NFTData, setNFTData] = useState();

  const nftCollection = async () => {
    setCollectionNft([]);
    OrigynClient.getInstance().init(true, await currentCanisterId());
    const response = await getNftCollectionMeta([]);
    console.log('response', response);
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


  useEffect(() => {
    nftCollection();
    const getData = async () => {
      if (actor && canisterId) {
        if (tokenId) {
          try {
            const response = await fetch(`https://${canisterId}.raw.ic0.app/-/${tokenId }/info`);
            const result = await (await response.text()).toString();
            // if there are empty values (formatted in the wrong way) 
            // we replace them with an empty string
            if (result.search(':,')) {
              setNFTData(JSON.parse(result.replaceAll(':,', ':"",')));
            } else {
              setNFTData(JSON.parse(result));
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          try {
            const response = await fetch(`https://${await currentCanisterId()}.raw.ic0.app/collection/info`);
            const result = await response.text();
            if (result.search(':,')) {
              setNFTData(JSON.parse(result.replaceAll(':,', ':"",')));
            } else {
              setNFTData(JSON.parse(result));
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    };
    getData();
  }, [actor, canisterId]);



  return (
    <Container maxWidth="xl">
      <Box>
        <SwitchCanisterCollection/>
        <Box component={Paper} elevation={3} sx={{ margin: 2, width: '100%', padding: 2 }}>
          {NFTData ? <NFTInfo metadata={NFTData} /> : null}
        </Box>
      </Box>
    </Container>
  );
};
export default Home;
