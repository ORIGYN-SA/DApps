import React, { useEffect, useState, useContext } from 'react';
import NFTInfo from '../NFTInfo';
import { OrigynClient, getNftCollectionMeta } from '@origyn/mintjs';
import { Container } from '@origyn/origyn-art-ui';
import { PerpetualOSContext } from '@dapp/features-context-provider';

const Home = () => {
  const context = useContext(PerpetualOSContext);
  const [NFTData, setNFTData] = useState();

  const nftCollection = async () => {
    await OrigynClient.getInstance().init(!context.isLocal, context.canisterId);
    const response = await getNftCollectionMeta();
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
    if (context.tokenId) {
      try {
        const response = await fetch(`${context.assetCanisterUrl}/-/${context.tokenId}/info`);
        const result = await response.text();
        setNFTData(JSON.parse(result.replace(':,', ':"",')));
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const response = await fetch(`${context.assetCanisterUrl}/collection/info`);
        const result = await response.text();
        setNFTData(JSON.parse(result.replace(':,', ':"",')));
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    document.title = 'Origyn NFT data browser';
  }, []);

  useEffect(() => {
    if (context.canisterId) {
      nftCollection();
      getData();
    }
  }, [context]);

  return <Container>{NFTData ? <NFTInfo metadata={NFTData} /> : null}</Container>;
};
export default Home;
