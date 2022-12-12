import React, { useEffect, useState, useContext } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { Grid, Box, Divider, Button } from '@mui/material';
import { Principal } from '@dfinity/principal';
import { NFTUpdateRequest, UpdateRequest, CandyValue } from './types/origyn_nft_reference.did';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

// data
import { getData, getPermissions, Nft_Data, Permission } from './data/data';
// inputs
import { Inputs } from './inputs/index';
// Context
import { MetadataContext } from './context';
// CheckOwner
import { checkOwner } from '@dapp/utils';

const NewForm = ({ metadata }: any) => {
  // IsOWNER
  const [isOwner, setIsOwner] = useState(false);

  // object with all the data
  const [apps, setApps] = useState<any[]>([]);
  const [libraryFields, setLibraryFields] = useState([]);
  const [data, setData] = useState<Nft_Data[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  // use the context
  const { app_id } = useContext(MetadataContext);
  const { actor, principal, loggedIn } = useContext(AuthContext);

  const handleAppsChange = (index, event, i = 0) => {
    if (event.target.name == 'app_id' || event.target.name == 'read') {
      let data = [...apps];
      data[index][event.target.name] = event.target.value;
      setApps(data);
    } else if (event.target.name == 'write_type') {
      let data = [...apps];
      data[index]['write']['type'] = event.target.value;
      setApps(data);
    } else if (event.target.name == 'write_list') {
      let data = [...apps];
      data[index]['write']['list'][i] = event.target.value;
      setApps(data);
    } else if (event.target.name == 'permissions_type') {
      let data = [...apps];
      data[index]['permissions']['type'] = event.target.value;
      setApps(data);
    } else if (event.target.name == 'permissions_list') {
      let data = [...apps];
      data[index]['permissions']['list'][i] = event.target.value;
      setApps(data);
    } else if (event.target.name.search('com.bm.sample.app') > -1) {
      let data = [...apps];
      data[index]['data'][event.target.name] = event.target.value;
      setApps(data);
    }
  };
  const handleLibraryChange = (index, event) => {
    let data = [...libraryFields];
    data[index][event.target.name] = event.target.value;
    setLibraryFields(data);
  };
  const [nft, setNft] = useState<any>({});
  const [nftName, setNftName] = useState<string>('brain 1');
  const [nftCol, setNftCol] = useState<BigInt>(16n);
  const [nftOwner, setNftOwner] = useState<string>(
    '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
  );
  const [nftCreator, setNftCreator] = useState<string>('bm');
  const getArrayData = async () => {
    const response = await getData();
    console.log('arraydata', response);
    if (response) {
      setData(response);
    }
  };
  const getArrayPermissions = async () => {
    const response = await getPermissions();
    console.log('arraypermissions', response);
    if (response) {
      setPermissions(response);
    }
  };
  useEffect(() => {
    getArrayData();
    getArrayPermissions();
  }, []);
  const submitData = async () => {
    let myCandy: CandyValue = {
      Class: [
        {
          name: 'app_id',
          value: {
            Text: app_id.value.toString(),
          },
          immutable: false,
        },
        {
          name: 'read',
          value: {
            Text: 'public',
          },
          immutable: true,
        },
        {
          name: 'write',
          value: {
            Class: [
              { name: 'type', value: { Text: 'allow' }, immutable: false },
              {
                name: 'list',
                value: {
                  Array: {
                    thawed: [
                      {
                        Principal: Principal.fromText(
                          '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
                        ),
                      },
                    ],
                  },
                },
                immutable: false,
              },
            ],
          },
          immutable: false,
        },
        {
          name: 'permissions',
          value: {
            Class: [
              { name: 'type', value: { Text: 'allow' }, immutable: false },
              {
                name: 'list',
                value: {
                  Array: {
                    thawed: [
                      {
                        Principal: Principal.fromText(
                          '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
                        ),
                      },
                    ],
                  },
                },
                immutable: false,
              },
            ],
          },
          immutable: false,
        },
        {
          name: 'data',
          value: {
            Class: [
              { name: 'com.bm.sample.app', value: { Text: nftName }, immutable: false },
              {
                name: 'com.bm.sample.app',
                value: { Nat: 16n },
                immutable: false,
              },
              {
                name: 'com.bm.sample.app',
                value: { Text: nftCreator },
                immutable: false,
              },
              {
                name: 'com.bm.sample.app',
                value: {
                  Principal: Principal.fromText(nftOwner),
                },
                immutable: false,
              },
            ],
          },
          immutable: false,
        },
        { name: 'owner', value: { Principal: Principal.fromText(nftOwner) }, immutable: false },
        { name: 'is_soulbound', value: { Bool: false }, immutable: false },
      ],
    };
    const { tokenId } = await useRoute();
    console.log('this is myCandy', myCandy);
    let ObjUpdateRequest: UpdateRequest = {
      id: tokenId,
      update: [],
    };
    let ObjNftUpdateRequest: NFTUpdateRequest = {
      update: {
        token_id: tokenId,
        update: ObjUpdateRequest,
        app_id: app_id.value.toString(),
      },
      replace: {
        token_id: tokenId,
        data: myCandy,
      },
    };
    console.log('this is ObjNftUpdateRequest', ObjNftUpdateRequest['replace']);
    const repData = await actor.update_app_nft_origyn({ replace: ObjNftUpdateRequest['replace'] });
    if (repData) {
      console.log('replace success', repData);
    } else {
      console.log('replace wrong', repData);
    }
  };
  const checkOwnerAndPermissions = async () => {
    const { tokenId, canisterId } = await useRoute();
    const checked = await checkOwner(principal, canisterId, tokenId);
    setIsOwner(checked);
    console.log('isOwner', checked);
  };
  useEffect(() => {
    if (loggedIn) {
      checkOwnerAndPermissions();
    } else {
      setIsOwner(false);
      console.log('not logged in');
    }
  }, [loggedIn]);
  return (
    <div>
      <Box>
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={2}>
            <b>Info</b>
          </Grid>
          <Grid item xs={10} sx={{}}>
            <List>
              {data?.map((item, index) => {
                return item.immutable === true ? (
                  <>
                    <ListItem key={index + item.name}>
                      <ListItemText primary={item.name} secondary={item.value} />
                    </ListItem>
                    <Divider />
                  </>
                ) : isOwner ? (
                  <>
                    <ListItem key={index + item.name}>
                      <ListItemText primary={item.name} secondary={item.value} />
                    </ListItem>
                    <>{Inputs[item.level](item)}</>
                    <Divider />
                  </>
                ) : (
                  <></>
                );
              })}
            </List>
          </Grid>
        </Grid>
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={2}>
            <b>Permissions</b>
          </Grid>
          <Grid item xs={10} sx={{}}>
            <List>
              {permissions?.map((item, index) => {
                return item.immutable === true ? (
                  item.name == 'list' ? (
                    <>
                      <ListItem key={index}>
                        <ListItemText
                          primary={item.type + ' ' + item.name}
                          secondary={item.list.map((item, index) => {
                            return (
                              <div key={index}>
                                <span>{item}</span>
                              </div>
                            );
                          })}
                        />
                      </ListItem>
                      <Divider />
                    </>
                  ) : (
                    <>
                      <ListItem key={index}>
                        <ListItemText primary={<b>{item.type}</b>} secondary={item.value} />
                      </ListItem>
                      <Divider />
                    </>
                  )
                ) : item.name == 'list' ? (
                  isOwner ? (
                    <>
                      <ListItem key={index}>
                        <ListItemText
                          primary={item.type + ' ' + item.name}
                          secondary={item.list.map((item, index) => {
                            return (
                              <div key={index}>
                                <span>{item}</span>
                              </div>
                            );
                          })}
                        />
                      </ListItem>
                      <>{Inputs[item.level](item)}</>
                      <Divider />
                    </>
                  ) : (
                    <>
                      <ListItem key={index}>
                        <ListItemText
                          primary={item.type + ' ' + item.name}
                          secondary={item.list.map((item, index) => {
                            return (
                              <div key={index}>
                                <span>{item}</span>
                              </div>
                            );
                          })}
                        />
                      </ListItem>
                      <Divider />
                    </>
                  )
                ) : isOwner ? (
                  <>
                    <ListItem key={index}>
                      <ListItemText primary={<b>{item.type}</b>} secondary={item.value} />
                    </ListItem>
                    <>{Inputs[item.level](item)}</>
                    <Divider />
                  </>
                ) : (
                  <>
                    <ListItem key={index}>
                      <ListItemText primary={<b>{item.type}</b>} secondary={item.value} />
                    </ListItem>
                    <Divider />
                  </>
                );
              })}
            </List>
          </Grid>
        </Grid>
        <Divider />
        <Button onClick={submitData}>Update</Button>
      </Box>
    </div>
  );
};
export default NewForm;