import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Grid, TextField, Button, Box, Typography, Icon } from '@mui/material';
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
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
// mintJs
import { getNft, getNftCollectionInfo, OrigynClient } from '@origyn-sa/mintjs';
import { ControlPointSharp } from '@mui/icons-material';

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

const NewForm = ({ metadata }: any) => {
  // array with ids of libraries for the current token
  const [librariesIDS, setLibrariesIDS] = useState<any>([]);
  const [owner, setOwner] = useState('');
  const [hiddenAsset, setHiddenAsset] = useState<Asset>();
  const [previewAsset, setPreviewAsset] = useState<Asset>();
  const [primaryAsset, setPrimaryAsset] = useState<Asset>();
  const [experienceAsset, setExperienceAsset] = useState<Asset>();

  const [id, setId] = useState('');
  const [apps, setApps] = useState([]);
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
    setOpenApp(!openApp)
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
    setOpenName(!openName)
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

  const { tokenId, actor, canisterId } = useContext(AuthContext);
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
        .nft_origyn(tokenId)
        .then((r) => {
          console.log(r);
          setNft(r);
        })
        .catch(console.log);
    }
  }, []);

  const getLibrariesIds = async () => {
    await OrigynClient.getInstance().init(true, canisterId);
    const response = await getNft(tokenId);
    console.log('rrrr', response);
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
    await OrigynClient.getInstance().init(true, canisterId);
    const response = await getNft(tokenId);
    if (response.ok) {
      const obj_preview_asset: Asset = {
        id: await response.ok.metadata.Class.filter((res) => {
          return res.name === 'preview_asset';
        })[0].value.Text,
        immutable: await response.ok.metadata.Class.filter((res) => {
          return res.name === 'preview_asset';
        })[0].immutable,
      };
      const obj_hidden_asset: Asset = {
        id: await response.ok.metadata.Class.filter((res) => {
          return res.name === 'hidden_asset';
        })[0].value.Text,
        immutable: await response.ok.metadata.Class.filter((res) => {
          return res.name === 'hidden_asset';
        })[0].immutable,
      };
      const obj_primary_asset: Asset = {
        id: await response.ok.metadata.Class.filter((res) => {
          return res.name === 'primary_asset';
        })[0].value.Text,
        immutable: await response.ok.metadata.Class.filter((res) => {
          return res.name === 'primary_asset';
        })[0].immutable,
      };
      const obj_experience_asset: Asset = {
        id: await response.ok.metadata.Class.filter((res) => {
          return res.name === 'experience_asset';
        })[0].value.Text,
        immutable: await response.ok.metadata.Class.filter((res) => {
          return res.name === 'experience_asset';
        })[0].immutable,
      };
      setPreviewAsset(obj_preview_asset);
      setHiddenAsset(obj_hidden_asset);
      setPrimaryAsset(obj_primary_asset);
      setExperienceAsset(obj_experience_asset);
    } else if (response.err) {
      console.log(response.err);
    }
  };

  useEffect(() => {
    getLibrariesIds();
    getAsset();
    console.log('token', tokenId);
    console.log('canister', canisterId);
    if (Object.entries(metadata).length) {
      setId(pick(metadata, ['id']).id);
      setApps(pick(metadata, ['__apps']).__apps);
      setLibraryFields(pick(metadata, ['library']).library);
    }
  }, [metadata]);

  const submitData = async () => {
    const nftId = nft?.metadata?.Class?.find(({ name }) => name === 'id').value.Text;

    let myCandy: CandyValue = {
      Class: [
        {
          name: 'app_id',
          value: {
            Text: 'com.bm.sample.app.name',
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
              { name: 'com.bm.sample.app.name', value: { Text: nftName }, immutable: false },
              {
                name: 'com.bm.sample.app.total_in_collection',
                value: { Nat: 16n },
                immutable: false,
              },
              {
                name: 'com.bm.sample.app.creator_name',
                value: { Text: nftCreator },
                immutable: false,
              },
              {
                name: 'com.bm.sample.app.creator_principal',
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
      id: nftId,
      update: [],
    };

    let ObjNftUpdateRequest: NFTUpdateRequest = {
      update: {
        token_id: nftId,
        update: ObjUpdateRequest,
        app_id: 'com.bm.sample.app.name',
      },
      replace: {
        token_id: nftId,
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

  console.log("apps",apps)

  
  return (
    <div>
      <Box>
        <List>
          <ListItemButton onClick={handleAssets}>
            <ListItemText>
              <b>Assets</b>
            </ListItemText>
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div">
              <ListItem>
                {hiddenAsset?.immutable ? (
                  <></>
                ) : (
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="edit"
                    onClick={handleHiddenAssets}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                <ListItemText>
                  <em>Hidden asset - </em>
                  <b>{hiddenAsset?.id}</b>
                </ListItemText>
              </ListItem>
            </List>
            <Collapse in={openHidden}>
              <Box m={2}>
                <Grid>
                  <Grid item xl={6} m={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Available Libraries</InputLabel>
                      <Select
                        labelId="hidden-assets-select-label"
                        id="hidden-assets-select"
                        label="Available libraries"
                        defaultValue={hiddenAsset?.id}
                      >
                        {librariesIDS.map((id, i) => (
                          <MenuItem value={id} key={i}>
                            {id}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xl={6} m={1}>
                    <Button variant="contained">Save</Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
            <List component="div">
              <ListItem>
                {
                  previewAsset?.immutable ? (
                    <></>
                  ) : (
                    <IconButton
                      edge="start"
                      color="inherit"
                      aria-label="edit"
                      onClick={handlePreviewAssets}
                    >
                      <EditIcon />
                    </IconButton>
                  )
                }
                <ListItemText>
                  <em>Preview asset - </em>
                  <b>{previewAsset?.id}</b>
                </ListItemText>
              </ListItem>
            </List>
            <Collapse in={openPreview}>
              <Box m={2}>
                <Grid>
                  <Grid item xl={6} m={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Available Libraries</InputLabel>
                      <Select
                        labelId="hidden-assets-select-label"
                        id="hidden-assets-select"
                        label="Available libraries"
                        defaultValue={previewAsset?.id}
                      >
                        {librariesIDS.map((id, i) => (
                          <MenuItem value={id} key={i}>
                            {id}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xl={6} m={1}>
                    <Button variant="contained">Save</Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
            <List component="div">
              <ListItem>
                {
                  primaryAsset?.immutable ? (
                    <></>
                  ) : (
                    <IconButton
                      edge="start"
                      color="inherit"
                      aria-label="edit"
                      onClick={handlePrimaryAssets}
                    >
                      <EditIcon />
                    </IconButton>
                  )
                }
                <ListItemText>
                  <em>Primary asset - </em>
                  <b>{primaryAsset?.id}</b>
                </ListItemText>
              </ListItem>
            </List>
            <Collapse in={openPrimary}>
              <Box m={2}>
                <Grid>
                  <Grid item xl={6} m={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Available Libraries</InputLabel>
                      <Select
                        labelId="hidden-assets-select-label"
                        id="hidden-assets-select"
                        label="Available libraries"
                        defaultValue={primaryAsset?.id}
                      >
                        {librariesIDS.map((id, i) => (
                          <MenuItem value={id} key={i}>
                            {id}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xl={6} m={1}>
                    <Button variant="contained">Save</Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
            <List component="div">
              <ListItem>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="edit"
                  onClick={handleExperienceAssets}
                >
                  <EditIcon />
                </IconButton>
                <ListItemText>
                  <em>Experience asset - </em> <b>{experienceAsset?.id}</b>
                </ListItemText>
              </ListItem>
            </List>
            <Collapse in={openExperience}>
              <Box m={2}>
                <Grid>
                  <Grid item xl={6} m={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Available Libraries</InputLabel>
                      <Select
                        labelId="hidden-assets-select-label"
                        id="hidden-assets-select"
                        label="Available libraries"
                        defaultValue={experienceAsset?.id}
                      >
                        {librariesIDS.map((id, i) => (
                          <MenuItem value={id} key={i}>
                            {id}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xl={6} m={1}>
                    <Button variant="contained">Save</Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Collapse>
          <ListItemButton onClick={handleApps}>
            <ListItemText primary="Apps" />
            {openApp ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openApp} timeout="auto" unmountOnExit>
          <ListItem>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="edit"
                  onClick={handleCreator}
                >
                  <EditIcon />
                </IconButton>
                <ListItemText>
                  <em>Creator: {"  "}</em>
                  <b>{apps[0]?.data['com.bm.sample.app.creator_name']}</b>
                </ListItemText>
          </ListItem>
          <Collapse in={openCreator}>
              <Box m={2}>
                <Grid>
                  <Grid item xl={6} m={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Creator</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Age"
                      >
                        <MenuItem value={10}>Creator1</MenuItem>
                        <MenuItem value={20}>Creator2</MenuItem>
                        <MenuItem value={30}>Creator3</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xl={6} m={1}>
                    <Button variant="contained">Save</Button>
                  </Grid>
                </Grid>
              </Box>
             </Collapse>
             <ListItem>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="edit"
                  onClick={handleName}
                >
                  <EditIcon />
                </IconButton>
                <ListItemText>
                  <em>Name: {"  "}</em>
                  <b>{apps[0]?.data['com.bm.sample.app.name']}</b>
                </ListItemText>
          </ListItem>
          <Collapse in={openName}>
              <Box m={2}>
                <Grid>
                  <Grid item xl={6} m={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Name</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Age"
                      >
                        <MenuItem value={10}>Name1</MenuItem>
                        <MenuItem value={20}>Name2</MenuItem>
                        <MenuItem value={30}>Name3</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xl={6} m={1}>
                    <Button variant="contained">Save</Button>
                  </Grid>
                </Grid>
              </Box>
             </Collapse>
             <ListItem>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="edit"
                  onClick={handlePrincipal}
                >
                  <EditIcon />
                </IconButton>
                <ListItemText>
                  <em>Principal: {"  "}</em>
                  <b>{apps[0]?.data['com.bm.sample.app.creator_principal']}</b>
                </ListItemText>
          </ListItem>
          <Collapse in={openPrincipal}>
              <Box m={2}>
                <Grid>
                  <Grid item xl={6} m={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Principal</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Age"
                      >
                        <MenuItem value={10}>Principal1</MenuItem>
                        <MenuItem value={20}>Principal2</MenuItem>
                        <MenuItem value={30}>Principal3</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xl={6} m={1}>
                    <Button variant="contained">Save</Button>
                  </Grid>
                </Grid>
              </Box>
             </Collapse>
             <ListItem>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="edit"
                  onClick={handleTotal}
                >
                  <EditIcon />
                </IconButton>
                <ListItemText>
                  <em>Collection total: {"  "}</em>
                  <b>{apps[0]?.data['com.bm.sample.app.total_in_collection']}</b>
                </ListItemText>
          </ListItem>
          <Collapse in={openTotal}>
              <Box m={2}>
                <Grid>
                  <Grid item xl={6} m={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Total</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Age"
                      >
                        <MenuItem value={10}>Total1</MenuItem>
                        <MenuItem value={20}>Total2</MenuItem>
                        <MenuItem value={30}>Total3</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xl={6} m={1}>
                    <Button variant="contained">Save</Button>
                  </Grid>
                </Grid>
              </Box>
             </Collapse>
            </Collapse>
        </List>
      </Box>
    </div>
  );
};

export default NewForm;

