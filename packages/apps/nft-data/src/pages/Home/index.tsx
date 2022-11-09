import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import NFTInfo from '../NFTInfo';

const Home = () => {
  const { tokenId, principal } = useContext(AuthContext);
  const [NFTData, setNFTData] = useState();
  const [canisterId, setCanisterId] = useState('');

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
    useRoute().then(({ canisterId }) => {
      setCanisterId(canisterId);
    });
  }, []);
  useEffect(() => {
    if (canisterId) {
      getData();
    }
  }, [canisterId]);

  return (
    <div>
      <div>
        <p>
          Canister ID: <b>{canisterId}</b>
        </p>
        <p>
          Token(NFT) ID: <b>{tokenId}</b>
        </p>
        <p>
          You principal: <b>{principal?.toText()}</b>
        </p>
        <div>
          <p>
            <b>NFT Data:</b>
          </p>
          {NFTData ? <NFTInfo metadata={NFTData} /> : null}
        </div>
      </div>
    </div>
  );
};
export default Home;
