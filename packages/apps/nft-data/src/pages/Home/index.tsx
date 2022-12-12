import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import NFTInfo from '../NFTInfo';
import { OrigynClient, getNftCollectionMeta } from '@origyn-sa/mintjs';
import { Container } from '@mui/material';

const currentCanisterId = async () => {
  const canisterId = await getCanisterId();
  return canisterId;
};


const Home = () => {
  const { actor } = useContext(AuthContext);
  const [tokenId, setTokenId] = useState();
  const [NFTData, setNFTData] = useState();
  const [canisterId, setCanisterId] = useState('');

  const nftCollection = async () => {
    const route = await useRoute();
    
    OrigynClient.getInstance().init(true, route.canisterId);
    const response = await getNftCollectionMeta([]);
    console.log('response', response);
    const collectionNFT = response.ok;
    const obj_token_ids: any = collectionNFT.token_ids[0];

    // In case we have URL with tokenID and we change canister,
    // We need to check if the tokenID is in the new canister
    // If not, we need to clear the URL and show the first tokenID in the new Canister
    // if (!obj_token_ids.includes(tokenId) && tokenId !== '') {
    //   let Url = window.location.href;
    //   Url = Url.replace(tokenId, obj_token_ids[0]);
    //   window.location.href = Url;
    // }
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
    useRoute().then(({ canisterId, tokenId }) => {
      setCanisterId(canisterId);
      setTokenId(tokenId);
    });
  }, []);

  useEffect(() => {
    if (canisterId) {
      nftCollection();
      getData();
    }
  }, [canisterId]);

  return (
    <Container>
      {NFTData ? (
          <NFTInfo metadata={NFTData} />
      ) : null}
    </Container>
  );
};
export default Home;
