import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication'
import { LoadingContainer } from '@dapp/features-components';
import TemplateRender from './TemplateRender';
import { useParams } from 'react-router-dom';

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
  if(obj.Class) {
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

const NFTPage = () => {
  const { actor } = useContext(AuthContext)
  const [template, setTemplate] = useState<any>();
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log(params);

    if (params.tokenId) {
      const responseNormalData = await fetch(
        `https://development.canister.origyn.ch/canister/v0/nft-token/${params.tokenId}/metadata`,
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
      console.log("DATA", data);
      
      try {
        const parsedData = parseCandyObj(
          data.metadata.meta.metadata
        );
        console.log(parsedData);
        // @ts-ignore
        setData(parsedData.__apps.find(({app_id}) => app_id === "public.metadata").data);
        // @ts-ignore
        setTemplate([parsedData.__apps.find(({app_id}) => app_id === "public.metadata.template").data[0]]);
      } catch (e){
        console.log(e);
        setData([]);
      }

    } else {
      
      const { canisterId, tokenId } = await useRoute();
      const resp =  await fetch(`https://${canisterId}.raw.ic0.app/-/${tokenId}/info`);
      const data = await resp.json();

      // const data = await actor.nft_origyn(tokenId);
      // const parsedData = parseCandyObj(
      //   data.metadata.meta.metadata
      // );
      const tmplt = [data.__apps.find(({app_id}) => app_id === "public.metadata.template").data[0]];
      const d = data.__apps.find(({app_id}) => app_id === "public.metadata").data;
      console.log(data, tmplt, d);
  
      setTemplate(tmplt);
      setData(d);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [])

  console.log(template, data);
  return (
    <>
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <TemplateRender templateObject={template} data={data} />
      )}
    </>
  );
};

export default NFTPage;
