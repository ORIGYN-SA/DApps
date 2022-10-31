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

const NewForm = ({ metadata }: any) => {
  console.log('METADATA', metadata);
  const [owner, setOwner] = useState('');
  const [hiddenAsset, setHiddenAsset] = useState('');
  const [previewAsset, setPreviewAsset] = useState('');
  const [primaryAsset, setPrimaryAsset] = useState('');
  const [experienceAsset, setExperienceAsset] = useState('');
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

  const getAssets = async () => {
    await OrigynClient.getInstance().init(true, canisterId);
    const response = await getNft('');
    const r2= await getNftCollectionInfo();
    console.log('response222', response);
    if (response.ok) {
      const { metadata } = response.ok;
      console.log('METADATA2', metadata);
      const ownerField = metadata?.find((data) => data.name === 'owner');
      console.log(ownerField.value.Principal.toText());
      // This will output the principal id of the owner of the NFT.
    } else if (response.err) {
      console.log(response.err);
    }
  };

  useEffect(() => {
    getAssets();
    if (Object.entries(metadata).length) {
      setOwner(pick(metadata, ['owner']).owner);
      setHiddenAsset(pick(metadata, ['hidden_asset']).hidden_asset);
      setPreviewAsset(pick(metadata, ['preview_asset']).preview_asset);
      setPrimaryAsset(pick(metadata, ['primary_asset']).primary_asset);
      setExperienceAsset(pick(metadata, ['experience_asset']).experience_asset);
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
            <ListItemText primary="Assets" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div">
              <ListItem>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="edit"
                  onClick={handleHiddenAssets}
                >
                  <EditIcon />
                </IconButton>
                <ListItemText>
                  <em>Hidden asset - </em>
                  <b>{hiddenAsset}</b>
                </ListItemText>
              </ListItem>
            </List>
            <Collapse in={openHidden}>
              <Box m={2}>
                <Grid>
                  <Grid item xl={6} m={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Age</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Age"
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
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
                  onClick={handlePreviewAssets}
                >
                  <EditIcon />
                </IconButton>
                <ListItemText>
                  <em>Preview asset - </em>
                  <b>{previewAsset}</b>
                </ListItemText>
              </ListItem>
            </List>
            <Collapse in={openPreview}>
              <Box m={2}>
                <Grid>
                  <Grid item xl={6} m={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Age</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Age"
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
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
                  onClick={handlePrimaryAssets}
                >
                  <EditIcon />
                </IconButton>
                <ListItemText>
                  <em>Primary asset - </em>
                  <b>{primaryAsset}</b>
                </ListItemText>
              </ListItem>
            </List>
            <Collapse in={openPrimary}>
              <Box m={2}>
                <Grid>
                  <Grid item xl={6} m={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Age</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Age"
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
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
                  <em>Experience asset - </em> <b>{experienceAsset}</b>
                </ListItemText>
              </ListItem>
            </List>
            <Collapse in={openExperience}>
              <Box m={2}>
                <Grid>
                  <Grid item xl={6} m={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Age</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Age"
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
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
                  <b>{apps[0]?.data['com.bm.sample.app.total_in_creation']}</b>
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

