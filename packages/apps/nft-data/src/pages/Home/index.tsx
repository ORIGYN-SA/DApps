import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, getTokenId, getCanisterId } from '@dapp/features-authentication';
import NFTInfo from '../NFTInfo';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { SwitchCanisterCollection } from '@dapp/features-components';
import Paper from '@mui/material/Paper';
import { OrigynClient, getNftCollectionMeta} from '@origyn-sa/mintjs';


const currentCanisterId = async () => {
  const canisterId = await getCanisterId();
  return canisterId;
};

const Home = () => {
  const { tokenId, actor } = useContext(AuthContext);
  const [NFTData, setNFTData] = useState();
  const [canisterId, setCanisterId] = useState("");

  const nftCollection = async () => {
    OrigynClient.getInstance().init(true, await currentCanisterId());
    const response = await getNftCollectionMeta([]);
    console.log('response', response);
    const collectionNFT = response.ok;
    const obj_token_ids: any = collectionNFT.token_ids[0];

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

  const getData = async () => {
      if (tokenId) {
        try {
          const response = await fetch(`https://${canisterId}.raw.ic0.app/-/${tokenId}/info`);
          const result = await response.text();
          if (result.search('"is_soulbound":,')) {
            setNFTData(JSON.parse(result.replace('"is_soulbound":,', '')));
          } else {
            setNFTData(JSON.parse(result));
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const response = await fetch(`https://${canisterId}.raw.ic0.app/collection/info`);
          const result = await response.text();
          if (result.search('"is_soulbound":,')) {
            setNFTData(JSON.parse(result.replace('"is_soulbound":,', '')));
          } else {
            setNFTData(JSON.parse(result));
          }
        } catch (err) {
          console.log(err);
        }
      }
  };

  useEffect(() => {
    getCanisterId().then((r) => {
      setCanisterId(r);
    });
  }, [])
  useEffect(() => {
    if (canisterId) {
      nftCollection();
      getData();
    }
  }, [canisterId]);



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
