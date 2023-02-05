import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication'
import { LoadingContainer } from '@dapp/features-components';
import TemplateRender from './TemplateRender';
import { useParams } from 'react-router-dom';
import { CandyToJson } from '../../../../../utils/src/candyParser';
import { ContactlessOutlined } from '@mui/icons-material';


const parseCandyObj = (obj) => {
  let field = {};
  if(obj.Class) {
    obj.Class.forEach((item) => {
      const type = Object.keys(item?.value || item)[0];
      const value = Object.values(item?.value || item)[0] as any;
      
      // console.log(type);
      if (type === "Class") {
        field[item.name] = value.forEach((item) => {
          const type = Object.keys(item?.value || item)[0];
          const value = Object.values(item?.value || item)[0] as any;
          
          // console.log(type);
          if (type === "Class") {
            field[item.name] = value.map(parseCandyObj);
            return;
          }
          if (type === "Array") {
            // Add Array handler
            const data = value.thawed.map(parseCandyObj)
            field[item.name] = data;
            return;
          }
          field[item.name] = value;
        });
        return;
      }
      if (type === "Array") {
        // Add Array handler
        const data = value.thawed.map(parseCandyObj)
        field[item.name] = data;
        return;
      }
      field[item.name] = value;
    });
    return field;
  }

  const type = Object.keys(obj?.value || obj)[0];
  const value = Object.values(obj?.value || obj)[0] as any;
  if (type === "Class") {
    const pData = {};
    value.forEach((item) => {
      const type = Object.keys(item?.value || item)[0];
      const value = Object.values(item?.value || item)[0] as any;
      
      // console.log(type);
      if (type === "Class") {
        pData[item.name] = value.forEach((item) => {
          const type = Object.keys(item?.value || item)[0];
          const value = Object.values(item?.value || item)[0] as any;
          
          // console.log(type);
          if (type === "Class") {
            pData[item.name] = value.map(parseCandyObj);
            return;
          }
          if (type === "Array") {
            // Add Array handler
            const data = value.thawed.map(parseCandyObj)
            pData[item.name] = data;
            return;
          }
          pData[item.name] = value;
        });
        return;
      }
      if (type === "Array") {
        // Add Array handler
        const data = value.thawed.map(parseCandyObj)
        pData[item.name] = data;
        return;
      }
      pData[item.name] = value;
    });
    console.log("Name",obj.name);
    field[obj.name] = pData;
    return field;
  }
  if (type === "Array") {
    // Add Array handler
    const arr = value.thawed.map(parseCandyObj);
    field[obj.name] = arr;
    return field;
  }
  if (obj.name) {
    field[obj.name] = obj.value;
    return field;
  }
  
  field = value;
  return field;

}

const NFTPage = () => {
  const [template, setTemplate] = useState<any>();
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

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
        setData(parsedData);
      } catch (e){
        console.log(e);
        setData([]);
      }

    } else {
      const { canisterId, tokenId } = await useRoute();
      const resp =  await fetch(`https://${canisterId}.raw.ic0.app/-/${tokenId}/info`);
      const data = await resp.json();
      console.log(data);
  
      setTemplate([data.__apps.find(({app_id}) => app_id === "public.metadata.template").data[0]]);
      setData(data.__apps.find(({app_id}) => app_id === "public.metadata").data);
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
