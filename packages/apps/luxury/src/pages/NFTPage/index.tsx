import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AuthContext, useRoute } from '@dapp/features-authentication'
import { LoadingContainer } from '@dapp/features-components';
import TemplateRender from './TemplateRender';

const getCandyValue = (obj) => {
  const type = Object.keys(obj?.value || obj)[0];
  const value = Object.values(obj?.value || obj)[0] as any;

  if (type === "Class") {
    const pData = {};
    value.forEach((item) => {
      pData[item.name] = getCandyValue(item);
    });
    return pData;
  }
  if (type === "Array") {
    // Add Array handler
    const arr = value.thawed.map(parseCandyObj);
    return arr;
  }
  return value;
}

const parseCandyObj = (obj) => {
  let field = {};
  if (obj.Class) {
    obj.Class.forEach((item) => {
      field[item.name] = getCandyValue(item);
    });
    return field;
  }

  const value = getCandyValue(obj);
  if (obj.name) {
    field[obj.name] = value;
    return field;
  }

  field = value;
  return field;

}

const WrapBlock = styled.div`
  background: #fff;
  
  > svg {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
  > div {
    position: relative;
    z-index: 1;
  }
`

const NFTPage = () => {
  const [template, setTemplate] = useState<any>();
  const [data, setData] = useState<any>();
  const [tokenId, setTokenId] = useState<any>();
  const [canisterId, setCanisterId] = useState<any>();
  const [b2bCanisterId, setB2bCanisterId] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const urlSearchParams = new URLSearchParams(window.location.search);
    const {tokenId, b2bCanisterId} = Object.fromEntries(urlSearchParams.entries());
    console.log("TTT", tokenId);

    if (tokenId) {
      setTokenId(tokenId);
      setCanisterId("63dd4b519e4e6389a6ab7557");
      setB2bCanisterId("63dd4b519e4e6389a6ab7557");
      const responseNormalData = await fetch(
        `https://development.canister.origyn.ch/canister/v0/nft-token/${tokenId}/metadata`,
        {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
        },
      );

      const data = await responseNormalData.json();
      console.log(data);
      try {
        const parsedData = parseCandyObj(
          data.metadata.meta.metadata
        );
        console.log(parsedData);
        // @ts-ignore
        setData(parsedData.__apps.find(({ app_id }) => app_id === "public.metadata").data);
        // @ts-ignore
        setTemplate([parsedData.__apps.find(({ app_id }) => app_id === "public.metadata.template").data[0]]);
      } catch (e) {
        console.log(e);
        setData([]);
      }

    } else {
      const { canisterId, tokenId } = await useRoute();
      setTokenId(tokenId);
      setCanisterId(canisterId);
      console.log("canisterId", canisterId);
      const resp = await fetch(`https://${canisterId}.raw.ic0.app/-/${tokenId}/info`);
      const data = await resp.json();

      // const data = await actor.nft_origyn(tokenId);
      // const parsedData = parseCandyObj(
      //   data.metadata.meta.metadata
      // );
      console.log(data);
      const tmplt = [data?.__apps.find(({ app_id }) => app_id === "public.metadata.template").data[0]];
      const d = data?.__apps.find(({ app_id }) => app_id === "public.metadata").data;

      setTemplate(tmplt);
      setData(d);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [])

  console.log(data, template);

  return (
    <WrapBlock>
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <>
          <div>
            <TemplateRender templateObject={template} data={{...data, tokenId, canisterId, b2bCanisterId}} />
          </div>
        </>
      )}
    </WrapBlock>
  );
};

export default NFTPage;
