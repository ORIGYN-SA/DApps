import React, { useContext, useEffect, useState} from 'react';
//import { AuthContext } from "../../hooks/auth";
import { AuthContext } from '@dapp/features-authentication';
import NFTInfo from '../NFTInfo';

/* function toJson(data) {
  if (data !== undefined) {
    return JSON.stringify(
      data,
      (_, v) => (typeof v === "bigint" ? `${v}#bigint` : v),
      "\t"
    ).replace(/"(-?\d+)#bigint"/g, (_, a) => a);
  }
} */
// function isJson(str) {
//   try {
//     JSON.parse(str);
//   } catch (e) {
//     return false;
//   }
//   return true;
// }
const Login = () => {
  const { /* logIn, loggedIn, */ tokenId, canisterId, principal, actor } = useContext(AuthContext);
  const [NFTData, setNFTData] = useState();

  useEffect(() => {
    const getData = async () => {
      // console.log(actor, canisterId);
      if (actor && canisterId) {
        if (tokenId) {
          try {
            const response = await fetch(`https://${canisterId}.raw.ic0.app/-/${tokenId}/info`);
            /* console.group(result.data);
              console.log(JSON.stringify(result.data)); */
            // console.log(isJson(JSON.stringify(result.data)));
            const result = await response.json();
            if (result.data.search('"is_soulbound":,')) {
              setNFTData(JSON.parse(result.data.replace('"is_soulbound":,', '')));
            } else {
              setNFTData(JSON.parse(result.data));
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          try {
            const response = await fetch(`https://${canisterId}.raw.ic0.app/collection/info`);
            const result = await response.json();
            if (result.data.search('"is_soulbound":,')) {
              setNFTData(JSON.parse(result.data.replace('"is_soulbound":,', '')));
            } else {
              setNFTData(JSON.parse(result.data));
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    };
    getData();
  }, [actor, canisterId]);

  /* const getMetadata =  (metadata) => { console.log(metadata);
    let data =  metadata.ok.metadata.Class;
    let owner = data.find(x=>x.name == 'owner').value.Principal._arr;
    owner = {owner: Principal.fromUint8Array(owner).toText()};
    
    const apps = data.find(x=>x.name == '__apps').value.Array.thawed[0].Class; 
    
    let obj = {};
    obj['app_id'] = apps.find(x=>x.name == 'app_id').value.Text;
    obj['read'] = apps.find(x=>x.name == 'read').value.Text;
    obj['write'] = {[apps.find(x=>x.name == 'write').value.Class[0].name]:apps.find(x=>x.name == 'write').value.Class[0].value.Text,
    [apps.find(x=>x.name == 'write').value.Class[1].name]: apps.find(x=>x.name == 'write').value.Class[1].value.Array.thawed.map(x=>Principal.fromUint8Array(x.Principal._arr).toText())
  };
  obj['permissions'] = {[apps.find(x=>x.name == 'permissions').value.Class[0].name]:apps.find(x=>x.name == 'permissions').value.Class[0].value.Text,
  [apps.find(x=>x.name == 'permissions').value.Class[1].name]: apps.find(x=>x.name == 'permissions').value.Class[1].value.Array.thawed.map(x=>Principal.fromUint8Array(x.Principal._arr).toText())
};
  obj['data'] = Object.assign({}, ...apps.find(x=>x.name == 'data').value.Class.map(x=>{
    if(x.value.Text) return {[x.name]: x.value.Text};
    else if(x.value.Nat) return {[x.name]: x.value.Nat.toString()};
    else if(x.value.Principal) return {[x.name]: Principal.fromUint8Array(x.value.Principal._arr).toText()};
    return {[x.name]: x.value}
  }));
  let __apps:Array<Object> = [];
  __apps.push(obj); console.log(metadata);
  // let hidden_asset = {'hidden_asset':data.find(x=>x.name == 'hidden_asset').value.Text};  
  let preview_asset = {'preview_asset':data.find(x=>x.name == 'preview_asset').value.Text};
  let primary_asset = {'primary_asset':data.find(x=>x.name == 'primary_asset').value.Text};
  let experience_asset = {'experience_asset':data.find(x=>x.name == 'experience_asset').value.Text};
  
  let id = {'id':data.find(x=>x.name == 'id').value.Text};
  let __system = {'__system':{[data.find(x=>x.name == '__system').value.Class[0].name]:data.find(x=>x.name == '__system').value.Class[0].value.Text}};

  let library = data.find(x=>x.name == 'library').value.Array.thawed.map(x=>{
    return  Object.assign({}, ...x.Class.map(y=>{
      return {[y.name]: y.value.Text};
    })); 
  }
  );
    let final_result = Object.assign({}, owner, {'__apps': __apps}, 
    //hidden_asset, 
    id, preview_asset, primary_asset, experience_asset, {'library':library});
    console.log(final_result);
    setNFTData(final_result);
    // return {metadata:{...final_result}}
  }; */

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
          {/* <pre>
              {
                // @ts-ignore
                toJson(NFTData)
              }
            </pre> */}
        </div>
      </div>
    </div>
  );
};
export default Login;
