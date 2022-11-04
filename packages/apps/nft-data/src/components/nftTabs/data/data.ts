import { AuthContext, getTokenId, getCanisterId } from '@dapp/features-authentication';
import { getNft, getNftCollectionMeta, OrigynClient } from '@origyn-sa/mintjs';

export type Nft_Data = {
  name: string;
  value: string | number;
  immutable: boolean;
  level: 'Asset' | 'App' | 'Id' | 'Permission';
};

export type Permission = { 
  level: 'Permission';
  type: 'Permission' | 'Write' | 'Read';
  name: string;
  value? : string; 
  list?: any[];
  immutable: boolean;
}

export const getData = async () => {
  let Data_Array: Nft_Data[] = [];
  await OrigynClient.getInstance().init(true, await getCanisterId());
  if (getTokenId()) {
    const response = await getNft(getTokenId());
    if (response.ok) {
      try {
        Data_Array.push(
          {
            name: 'Id',
            value: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'id';
            })[0].value.Text,
            immutable: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'id';
            })[0].immutable,
            level: 'Id',
          },
          {
            name: 'Owner',
            value: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'owner';
            })[0].value.Principal.toText(),
            immutable: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'owner';
            })[0].immutable,
            level: 'Id',
          },
          {
            name: 'Preview',
            value: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'preview_asset';
            })[0].value.Text,
            immutable: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'preview_asset';
            })[0].immutable,
            level: 'Asset',
          },
          {
            name: 'Hidden',
            value: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'hidden_asset';
            })[0].value.Text,
            immutable: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'hidden_asset';
            })[0].immutable,
            level: 'Asset',
          },
          {
            name: 'Primary',
            value: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'primary_asset';
            })[0].value.Text,
            immutable: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'primary_asset';
            })[0].immutable,
            level: 'Asset',
          },
          {
            name: 'Experience',
            value: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'experience_asset';
            })[0].value.Text,
            immutable: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'experience_asset';
            })[0].immutable,
            level: 'Asset',
          },
          {
            name: 'App_Id',
            value: await response.ok.metadata.Class.filter((res) => {
              return res.name === '__apps';
            })[0].value.Array.thawed[0].Class[0].value.Text,
            immutable: await response.ok.metadata.Class.filter((res) => {
              return res.name === '__apps';
            })[0].value.Array.thawed[0].Class[0].immutable,
            level: 'App',
          },
          {
            name: 'Read',
            value: await response.ok.metadata.Class.filter((res) => {
              return res.name === '__apps';
            })[0].value.Array.thawed[0].Class[1].value.Text,
            immutable: await response.ok.metadata.Class.filter((res) => {
              return res.name === '__apps';
            })[0].value.Array.thawed[0].Class[1].immutable,
            level: 'Permission',
          }
        );

        // Apps level 
        const apps = await response.ok.metadata.Class.filter((res) => {
          return res.name === '__apps';
        })[0].value.Array.thawed[0].Class[4].value.Class;
        let i: string;
        for (i in apps) {
          console.log(apps[i]);
          if (apps[i].value.hasOwnProperty('Principal')) {
            Data_Array.push({
              name: apps[i].name,
              value: apps[i].value.Principal.toText(),
              immutable: apps[i].immutable,
              level: 'App',
            });
          } else if (apps[i].value.hasOwnProperty('Nat')) {
            Data_Array.push({
              name: apps[i].name,
              value: apps[i].value.Nat.toString(),
              immutable: apps[i].immutable,
              level: 'App',
            });
          } else {
            Data_Array.push({
              name: apps[i].name,
              value: apps[i].value.Text,
              immutable: apps[i].immutable,
              level: 'App',
            });
          }
        }


      } catch (e) {
        console.log(e);
      }

    }
  } else {
    console.log('no token id - collectionMetadata');
    console.log('collectionMetadata', await getNftCollectionMeta());
    const response = await getNftCollectionMeta();
    if (response.ok) {
      try {
        Data_Array.push(
          {
            name: 'Id',
            value: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === 'id';
            })[0].value.Text,
            immutable: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === 'id';
            })[0].immutable,
            level: 'Id',
          },
          {
            name: 'Owner',
            value: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === 'owner';
            })[0].value.Principal.toText(),
            immutable: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === 'owner';
            })[0].immutable,
            level: 'Id',
          },
          {
            name: 'Preview',
            value: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === 'preview_asset';
            })[0].value.Text,
            immutable: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === 'preview_asset';
            })[0].immutable,
            level: 'Asset',
          },
          {
            name: 'Hidden',
            value: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === 'hidden_asset';
            })[0].value.Text,
            immutable: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === 'hidden_asset';
            })[0].immutable,
            level: 'Asset',
          },
          {
            name: 'Primary',
            value: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === 'primary_asset';
            })[0].value.Text,
            immutable: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === 'primary_asset';
            })[0].immutable,
            level: 'Asset',
          },
          {
            name: 'Experience',
            value: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === 'experience_asset';
            })[0].value.Text,
            immutable: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === 'experience_asset';
            })[0].immutable,
            level: 'Asset',
          },
          {
            name: 'App_Id',
            value: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === '__apps';
            })[0].value.Array.thawed[0].Class[0].value.Text,
            immutable: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === '__apps';
            })[0].value.Array.thawed[0].Class[0].immutable,
            level: 'App',
          },
          {
            name: 'Read',
            value: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === '__apps';
            })[0].value.Array.thawed[0].Class[1].value.Text,
            immutable: await response.ok.metadata[0].Class.filter((res) => {
              return res.name === '__apps';
            })[0].value.Array.thawed[0].Class[1].immutable,
            level: 'Permission',
          }
        );

        // Apps level 
        const apps = await response.ok.metadata[0].Class.filter((res) => {
          return res.name === '__apps';
        })[0].value.Array.thawed[0].Class[4].value.Class;
        let i: string;
        for (i in apps) {
          console.log(apps[i]);
          if (apps[i].value.hasOwnProperty('Principal')) {
            Data_Array.push({
              name: apps[i].name,
              value: apps[i].value.Principal.toText(),
              immutable: apps[i].immutable,
              level: 'App',
            });
          } else if (apps[i].value.hasOwnProperty('Nat')) {
            Data_Array.push({
              name: apps[i].name,
              value: apps[i].value.Nat.toString(),
              immutable: apps[i].immutable,
              level: 'App',
            });
          } else {
            Data_Array.push({
              name: apps[i].name,
              value: apps[i].value.Text,
              immutable: apps[i].immutable,
              level: 'App',
            });
          }
        }


      } catch (e) {
        console.log(e);
      }
    }
  };
  return Data_Array;
}

export const getPermissions = async () => {

  let Allowed_Array : Permission[]= [];

  await OrigynClient.getInstance().init(true, await getCanisterId());

  if (getTokenId()) {
    const response = await getNft(getTokenId());
    if (response.ok) {
      try{
        let array_write =  await response.ok.metadata.Class.filter((res) => {
          return res.name === '__apps';
        })[0].value.Array.thawed[0].Class[2].value.Class;
        let i:any;
        for (i in array_write) {
          if(array_write[i].value.hasOwnProperty('Array')){

            let list = [];
            let j:any;
            for (j in array_write[i].value.Array.thawed) {
              list.push(array_write[i].value.Array.thawed[j].Principal.toText());
            }

            Allowed_Array.push({
              level: 'Permission',
              name: array_write[i].name,
              immutable: array_write[i].immutable,
              list: list,
              type: 'Write',
            });
          }else{
          Allowed_Array.push({
            level: 'Permission',
            name: array_write[i].name,
            immutable: array_write[i].immutable,
            value: array_write[i].value.Text,
            type: 'Write',
          });
        }
      }
      
      let array_permission = await response.ok.metadata.Class.filter((res) => {
        return res.name === '__apps';
      })[0].value.Array.thawed[0].Class[3].value.Class;
      let k:any;
      for (k in array_permission) {
        if(array_permission[k].value.hasOwnProperty('Array')){

          let list = [];
          let l:any;
          for (l in array_permission[k].value.Array.thawed) {
            list.push(array_permission[k].value.Array.thawed[l].Principal.toText());
          }

          Allowed_Array.push({
            level: 'Permission',
            name: array_permission[k].name,
            immutable: array_permission[k].immutable,
            list: list,
            type: 'Permission',
          });
        }else{
        Allowed_Array.push({
          
          name: array_permission[k].name,
          immutable: array_permission[k].immutable,
          value: array_permission[k].value.Text,
          type: 'Permission',
        });
      }
    }
      }catch(e){
        console.log(e);
      }
    }
    return Allowed_Array;
  }else{
    const response = await getNftCollectionMeta();
    if (response.ok) {
      try{
        let array_write =  await response.ok.metadata[0].Class.filter((res) => {
          return res.name === '__apps';
        })[0].value.Array.thawed[0].Class[2].value.Class;
        let i:any;
        for (i in array_write) {
          if(array_write[i].value.hasOwnProperty('Array')){

            let list = [];
            let j:any;
            for (j in array_write[i].value.Array.thawed) {
              list.push(array_write[i].value.Array.thawed[j].Principal.toText());
            }

            Allowed_Array.push({
              level: 'Permission',
              name: array_write[i].name,
              immutable: array_write[i].immutable,
              list: list,
              type: 'Write',
            });
          }else{
          Allowed_Array.push({
            level: 'Permission',
            name: array_write[i].name,
            immutable: array_write[i].immutable,
            value: array_write[i].value.Text,
            type: 'Write',
          });
        }
      }
      
      let array_permission = await response.ok.metadata[0].Class.filter((res) => {
        return res.name === '__apps';
      })[0].value.Array.thawed[0].Class[3].value.Class;
      let k:any;
      for (k in array_permission) {
        if(array_permission[k].value.hasOwnProperty('Array')){

          let list = [];
          let l:any;
          for (l in array_permission[k].value.Array.thawed) {
            list.push(array_permission[k].value.Array.thawed[l].Principal.toText());
          }

          Allowed_Array.push({
            level: 'Permission',
            name: array_permission[k].name,
            immutable: array_permission[k].immutable,
            list: list,
            type: 'Permission',
          });
        }else{
        Allowed_Array.push({
          level: 'Permission',
          name: array_permission[k].name,
          immutable: array_permission[k].immutable,
          value: array_permission[k].value.Text,
          type: 'Permission',
        });
      }
    }
      }catch(e){
        console.log(e);
      }
    }
    return Allowed_Array;
  }
};