import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, useRoute, useSessionContext } from '@dapp/features-authentication';
import NFTInfo from '../NFTInfo';
import { isLocal } from '@dapp/utils';

const Home = () => {
  const { localDevelopment } = useSessionContext();
  const { tokenId, principal } = useContext(AuthContext);
  const [NFTData, setNFTData] = useState();
  const [canisterId, setCanisterId] = useState('');

  const getData = async () => {
    const url =
      isLocal() && localDevelopment
        ? `http://${canisterId}.localhost:8000`
        : `https://${canisterId}.raw.ic0.app`;
    if (tokenId) {
      try {
        const response = await fetch(url + '/-/${tokenId}/info');
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
        const response = await fetch(url + '/collection/info');
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
