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
  name : string;
  value : string | number;
  immutable : boolean;
}

const NewForm = ({ metadata }: any) => {
  // array with ids of libraries for the current token
  const [librariesIDS, setLibrariesIDS] = useState<any>([]);
  // object with all the data
  const [owner, setOwner] = useState('');
  const [hiddenAsset, setHiddenAsset] = useState<Asset>();
  const [previewAsset, setPreviewAsset] = useState<Asset>();
  const [primaryAsset, setPrimaryAsset] = useState<Asset>();
  const [experienceAsset, setExperienceAsset] = useState<Asset>();
  const [appsNames, setAppsNames] = useState<any>([]);
  const [id, setId] = useState('');
  const [apps, setApps] = useState<App[]>([]);
  const [appId, setAppId] = useState('');
  const [libraryFields, setLibraryFields] = useState([]);

  //---------| 1. List - Collapse |---------//
  const [open, setOpen] = React.useState(false);
  const [openApp, setOpenApp] = React.useState(false);
  const [openHidden, setOpenHidden] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [openPrimary, setOpenPrimary] = React.useState(false);
  const [openExperience, setOpenExperience] = React.useState(false);
  const [openName, setOpenName] = React.useState(false);
  const [openCreator, setOpenCreator] = React.useState(false);
  const [openPrincipal, setOpenPrincipal] = React.useState(false);
  const [openTotal, setOpenTotal] = React.useState(false);

  const handleAssets = () => {
    setOpen(!open);
  };
  const handleApps = () => {
    setOpenApp(!openApp);
  };
  const handleHiddenAssets = () => {
    setOpenHidden(!openHidden);
  };
  const handleCreator = () => {
    setOpenCreator(!openCreator);
  };
  const handlePreviewAssets = () => {
    setOpenPreview(!openPreview);
  };
  const handlePrimaryAssets = () => {
    setOpenPrimary(!openPrimary);
  };
  const handleExperienceAssets = () => {
    setOpenExperience(!openExperience);
  };
  const handleName = () => {
    setOpenName(!openName);
  };
  const handlePrincipal = () => {
    setOpenPrincipal(!openPrincipal);
  };
  const handleTotal = () => {
    setOpenTotal(!openTotal);
  };

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

  const getAsset = async () => {
    await OrigynClient.getInstance().init(true, await getCanisterId());
    if (getTokenId()) {
      const response = await getNft(getTokenId());
      if (response.ok) {
        // Id
        try {
          setId(
            await response.ok.metadata.Class.filter((res) => {
              return res.name === 'id';
            })[0].value.Text,
          );
        } catch (e) {
          console.log(e);
        }
        // Owner
        try {
          setOwner(
            await response.ok.metadata.Class.filter((res) => {
              return res.name === 'owner';
            })[0].value.Principal.toText(),
          );
        } catch (e) {
          console.log(e);
        }
        // Preview Asset
        try {
          const obj_preview_asset: Asset = {
            id: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'preview_asset';
            })[0].value.Text,
            immutable: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'preview_asset';
            })[0].immutable,
          };
          setPreviewAsset(obj_preview_asset);
        } catch (e) {
          console.log(e);
        }
        // Hidden Asset
        try {
          const obj_hidden_asset: Asset = {
            id: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'hidden_asset';
            })[0].value.Text,
            immutable: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'hidden_asset';
            })[0].immutable,
          };
          setHiddenAsset(obj_hidden_asset);
        } catch (e) {
          console.log(e);
        }
        // Primary Asset
        try {
          const obj_primary_asset: Asset = {
            id: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'primary_asset';
            })[0].value.Text,
            immutable: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'primary_asset';
            })[0].immutable,
          };
          setPrimaryAsset(obj_primary_asset);
        } catch (e) {
          console.log(e);
        }
        // Experience Asset
        try {
          const obj_experience_asset: Asset = {
            id: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'experience_asset';
            })[0].value.Text,
            immutable: await response.ok.metadata.Class.filter((res) => {
              return res.name === 'experience_asset';
            })[0].immutable,
          };
          setExperienceAsset(obj_experience_asset);
        } catch (e) {
          console.log(e);
        }

        // Data Names
        try {
          setAppsNames(
            await response.ok.metadata.Class.filter((res) => {
              return res.name === '__apps';
            })[0].value.Array.thawed[0].Class[4].value.Class,
          );
        } catch (e) {
          console.log(e);
        }
      } else if (response.err) {
        console.log(response.err);
      }

      // Apps
      try {
        const apps = await response.ok.metadata.Class.filter((res) => {
          return res.name === '__apps';
        })[0].value.Array.thawed[0].Class[4].value.Class;
        let i; 
        let appsArray : App[]= [];
        for(i in apps) {

          console.log(apps[i]);
          if(apps[i].value.hasOwnProperty('Principal')) {
            appsArray.push({
              name: apps[i].name,
              value: apps[i].value.Principal.toText(),
              immutable: apps[i].immutable,
            })
          }else if(apps[i].value.hasOwnProperty('Nat')){
            appsArray.push({
              name: apps[i].name,
              value: apps[i].value.Nat.toString(),
              immutable: apps[i].immutable,
            })
          }else{
              appsArray.push({
                name: apps[i].name,
                value: apps[i].value.Text,
                immutable: apps[i].immutable,
              })
            }
            
          }
          console.log(appsArray);
          setApps(appsArray);
      } catch (e) {
        console.log(e);
      }

      // App id 
      try {
        setAppId(
          await response.ok.metadata[0].Class.filter((res) => {
            return res.name === 'app_id';
          })[0].value.Text,
        );
      } catch (e) {
        console.log(e);
      }

    } else {
      console.log('no token id - collectionMetadata');
      console.log('collectionMetadata', await getNftCollectionMeta());

      const response = await getNftCollectionMeta();
      // Preview Asset
      try {
        const obj_preview_asset: Asset = {
          id: await response.ok.metadata[0].Class.filter((res) => {
            return res.name === 'preview_asset';
          })[0].value.Text,
          immutable: await response.ok.metadata[0].Class.filter((res) => {
            return res.name === 'preview_asset';
          })[0].immutable,
        };
        setPreviewAsset(obj_preview_asset);
      } catch (e) {
        console.log(e);
      }
      // Hidden Asset
      try {
        const obj_hidden_asset: Asset = {
          id: await response.ok.metadata[0].Class.filter((res) => {
            return res.name === 'hidden_asset';
          })[0].value.Text,
          immutable: await response.ok.metadata[0].Class.filter((res) => {
            return res.name === 'hidden_asset';
          })[0].immutable,
        };
        setHiddenAsset(obj_hidden_asset);
      } catch (e) {
        console.log(e);
      }

      // Primary Asset
      try {
        const obj_primary_asset: Asset = {
          id: await response.ok.metadata[0].Class.filter((res) => {
            return res.name === 'primary_asset';
          })[0].value.Text,
          immutable: await response.ok.metadata[0].Class.filter((res) => {
            return res.name === 'primary_asset';
          })[0].immutable,
        };
        setPrimaryAsset(obj_primary_asset);
      } catch (e) {
        console.log(e);
      }

      // Experience Asset
      try {
        const obj_experience_asset: Asset = {
          id: await response.ok.metadata[0].Class.filter((res) => {
            return res.name === 'experience_asset';
          })[0].value.Text,
          immutable: await response.ok.metadata[0].Class.filter((res) => {
            return res.name === 'experience_asset';
          })[0].immutable,
        };
        setExperienceAsset(obj_experience_asset);
      } catch (e) {
        console.log(e);
      }
      // Data Names
      try {
        setAppsNames(
          await response.ok.metadata[0].Class.filter((res) => {
            return res.name === '__apps';
          })[0].value.Array.thawed[0].Class[4].value.Class,
        );
      } catch (e) {
        console.log(e);
      }

      // Owner
      try {
        setOwner(
          await response.ok.metadata[0].Class.filter((res) => {
            return res.name === 'owner';
          })[0].value.Principal.toText(),
        );
      } catch (e) {
        console.log(e);
      }

      // Id
      try {
        setId(
          await response.ok.metadata[0].Class.filter((res) => {
            return res.name === 'id';
          })[0].value.Text,
        );
      } catch (e) {
        console.log(e);
      }

      // Apps
      try {
        const apps = await response.ok.metadata[0].Class.filter((res) => {
          return res.name === '__apps';
        })[0].value.Array.thawed[0].Class[4].value.Class;
        let i; 
        let appsArray : App[]= [];
        for(i in apps) {

          console.log(apps[i]);
          if(apps[i].value.hasOwnProperty('Principal')) {
            appsArray.push({
              name: apps[i].name,
              value: apps[i].value.Principal.toText(),
              immutable: apps[i].immutable,
            })
          }else if(apps[i].value.hasOwnProperty('Nat')){
            appsArray.push({
              name: apps[i].name,
              value: apps[i].value.Nat.toString(),
              immutable: apps[i].immutable,
            })
          }else{
              appsArray.push({
                name: apps[i].name,
                value: apps[i].value.Text,
                immutable: apps[i].immutable,
              })
            }
            
          }
          console.log(appsArray);
          setApps(appsArray);
        } catch (e) {
        console.log(e);
      }


    }
  };

  useEffect(() => {
    getAsset();
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
            Info
          </Grid>
          <Grid item xs={10} sx={{}}>
            <List>
              <ListItem secondaryAction={<ListItemText primary={owner} />}>
                <ListItemText primary={'owner'} />
              </ListItem>
              <Divider />
              <ListItem secondaryAction={<ListItemText primary={id} />}>
                <ListItemText primary={'id'} />
              </ListItem>
              <Divider />
              <ListItem secondaryAction={<ListItemText primary={hiddenAsset?.id} />}>
                <ListItemText primary={'hidden_asset'} />
              </ListItem>
              <Divider />
              <ListItem secondaryAction={<ListItemText primary={previewAsset?.id} />}>
                <ListItemText primary={'preview_asset'} />
              </ListItem>
              <Divider />
              <ListItem secondaryAction={<ListItemText primary={primaryAsset?.id} />}>
                <ListItemText primary={'primary_asset'} />
              </ListItem>
              <Divider />
              <ListItem secondaryAction={<ListItemText primary={experienceAsset?.id} />}>
                <ListItemText primary={'experience_asset'} />
              </ListItem>
              <Divider />
            </List>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={2}>
            Apps
          </Grid>
          <Grid item xs={10} sx={{}}>
            <List>
            {
              apps?.map((app, index) => {
                return (
                  <ListItem key={index} secondaryAction={<ListItemText primary={app.value} />}>
                    <ListItemText primary={app.name} />
                  </ListItem>
                )
            }
            )}
            </List>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={2}>
            Apps
          </Grid>
          <Grid item xs={10} sx={{}}>
            
            <List>
            {
              apps?.map((app, index) => {
                return (
                  <ListItem key={index} secondaryAction={<ListItemText primary={app.value} />}>
                    <ListItemText primary={app.name} />
                  </ListItem>
                )
            }
            )}
            </List>
          </Grid>
        </Grid>

      </Box>
    </div>
  );
};

export default NewForm;
