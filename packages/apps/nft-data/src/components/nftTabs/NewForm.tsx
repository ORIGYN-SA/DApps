import React, { useEffect, useState, useContext } from 'react';
import { AuthContext, getTokenId, getCanisterId } from '@dapp/features-authentication';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Grid, TextField, Button, Box, Divider } from '@mui/material';
import pick from 'lodash/pick';
import { Principal } from '@dfinity/principal';
import { NFTUpdateRequest, UpdateRequest, CandyValue } from './types/origyn_nft_reference.did';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';

// mintJs
import { getNft, getNftCollectionMeta, OrigynClient } from '@origyn-sa/mintjs';
// data
import { getData, getPermissions, Nft_Data, Permission } from './data/data';
// inputs 
import { Inputs } from './inputs/index';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

type Asset = {
  id: string;
  immutable: boolean;
};

type App = {
  name: string;
  value: string | number;
  immutable: boolean;
};

const NewForm = ({ metadata }: any) => {
  // array with ids of libraries for the current token
  const [librariesIDS, setLibrariesIDS] = useState<any>([]);
  // object with all the data
  const [appsNames, setAppsNames] = useState<any>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [libraryFields, setLibraryFields] = useState([]);
  const [data, setData] = useState<Nft_Data[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

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

  const { actor } = useContext(AuthContext);
  const [nft, setNft] = useState<any>({});
  const [nftName, setNftName] = useState<string>('brain 1');
  const [nftCol, setNftCol] = useState<BigInt>(16n);
  const [nftOwner, setNftOwner] = useState<string>(
    '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
  );
  const [nftCreator, setNftCreator] = useState<string>('bm');

  useEffect(() => {
    if (actor) {
      actor
        .nft_origyn(getTokenId())
        .then((r) => {
          console.log(r);
        })
        .catch(console.log);
    }
  }, []);

  const getLibrariesIds = async () => {
    await OrigynClient.getInstance().init(true, await getCanisterId());
    const response = await getNft(getTokenId());
    if (response.ok) {
      const libraries = response.ok.metadata.Class.filter((res) => {
        return res.name === 'library';
      })[0].value.Array.thawed;
      let arrayIDS = [];
      console.log('library', libraries);
      libraries.forEach((library: any) => {
        arrayIDS.push(library.Class[0].value.Text);
      });
      setLibrariesIDS(arrayIDS);
    } else if (response.err) {
      console.log(response.err);
    }
  };

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
            Text: appsNames[0].value.Text,
          },
          immutable: true,
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
              { name: appsNames[0].name, value: { Text: nftName }, immutable: false },
              {
                name: appsNames[1].name,
                value: { Nat: 16n },
                immutable: false,
              },
              {
                name: appsNames[2].name,
                value: { Text: nftCreator },
                immutable: false,
              },
              {
                name: appsNames[3].name,
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
    console.log('this is myCandy', myCandy);

    let ObjUpdateRequest: UpdateRequest = {
      id: getTokenId(),
      update: [],
    };

    let ObjNftUpdateRequest: NFTUpdateRequest = {
      update: {
        token_id: getTokenId(),
        update: ObjUpdateRequest,
        app_id: appsNames[0].value.Text,
      },
      replace: {
        token_id: getTokenId(),
        data: myCandy,
      },
    };

    console.log('this is ObjNftUpdateRequest', ObjNftUpdateRequest['replace']);

    const repData = await actor.update_app_nft_origyn({ replace: ObjNftUpdateRequest['replace'] });

    if (repData) {
      console.log('replace success');
    } else {
      console.log('replace wrong', repData);
    }
  };

  return (
    <div>
      <Box>
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={2}>
            <b>Info</b>
          </Grid>
          <Grid item xs={10} sx={{}}>
            <List>
              {
                data?.map((item, index) => {
                  return (
                  item.immutable===true ? (
                    <>
                    <ListItem key={index + item.name}>
                      <ListItemText primary={item.name} secondary={item.value} />
                    </ListItem>
                    <Divider />
                    </>
                  ):(
                    <>
                     <ListItem key={index + item.name}>
                      <ListItemText primary={item.name} secondary={item.value} />
                    </ListItem>
                    <>
                    {
                      Inputs[item.level](item)
                    }
                    </>
                    <Divider />
                    </>
                  ))}
                )
              }
            </List>
          </Grid>
        </Grid>
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={2}>
            <b>Permissions</b>
          </Grid>
          <Grid item xs={10} sx={{}}>
            <List>
              { 
                permissions?.map((item, index) => {
                  return (
                  item.immutable===true ? (
                  
                      item.name== 'list' ? (                 
                        <>
                          <ListItem key={index}>
                            <ListItemText primary={item.type+' '+item.name} secondary={
                              item.list.map((item, index) => {
                                return (
                                  <div key={index}>
                                    <span>{item}</span>
                                  </div>
                                );                         
                              })
                            } />
                          </ListItem>
                          <Divider />
                        </>
                      ) : (
                        <>
                          <ListItem key={index}>
                            <ListItemText primary={<b>{item.type}</b>} secondary={item.value}/>
                          </ListItem>
                          <Divider />
                        </>
                      )
                      
                  ):(
                    item.name== 'list' ? (                 
                      <>
                        <ListItem key={index}>
                          <ListItemText primary={item.type+' '+item.name} secondary={
                            item.list.map((item, index) => {
                              return (
                                <div key={index}>
                                  <span>{item}</span>
                                </div>
                              );                         
                            })
                          } />
                        </ListItem>
                        <>
                        {
                          Inputs[item.level](item)
                        }
                        </>
                        <Divider />
                      </>
                    ) : (
                      <>
                        <ListItem key={index}>
                          <ListItemText primary={<b>{item.type}</b>} secondary={item.value}/>
                        </ListItem>
                        <>
                        {
                          Inputs[item.level](item)
                        }
                        </>
                        <Divider />
                      </>
                    )
                  ))}
                )
              }

            </List>
          </Grid>
        </Grid>
        <Divider />
      </Box>
    </div>
  );
};

export default NewForm;
