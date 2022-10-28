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
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

import ControlPointIcon from '@mui/icons-material/ControlPoint';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

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
  const [openHidden, setOpenHidden] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [openPrimary, setOpenPrimary] = React.useState(false);
  const [openExperience, setOpenExperience] = React.useState(false);

  const handleAssets = () => {
    setOpen(!open);
  };
  const handleHiddenAssets = () => {
    setOpenHidden(!openHidden);
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

  useEffect(() => {
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

  const { tokenId, actor } = useContext(AuthContext);
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
          setNft(r.ok);
        })
        .catch(console.log);
    }
  }, []);

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
                <IconButton edge="start" color="inherit" aria-label="edit" onClick={handleHiddenAssets}>
                  <EditIcon />
                </IconButton>
                  <ListItemText>
                    <em>Hidden asset - </em>
                    {hiddenAsset}
                  </ListItemText>
              </ListItem>
            </List>
            <Collapse in={openHidden}>
              <Box m={2}>
                <Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={1}>
                      <Typography>{hiddenAsset}</Typography>
                      <Chip label="Edit" />
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
            <List component="div">
              <ListItem>
                <IconButton edge="start" color="inherit" aria-label="edit"  onClick={handlePreviewAssets}>
                  <EditIcon />
                </IconButton>
                  <ListItemText>
                    <em>Preview asset - </em>
                    {previewAsset}
                  </ListItemText>
              </ListItem>
            </List>
            <Collapse in={openPreview}>
              <Box m={2}>
                <Typography variant="body2" component="p">
                  {previewAsset}
                </Typography>
              </Box>
            </Collapse>
            <List component="div">
              <ListItem>
                <IconButton edge="start" color="inherit" aria-label="edit"  onClick={handlePrimaryAssets}>
                  <EditIcon />
                </IconButton>
                  <ListItemText>
                    <em>Primary asset - </em>
                    {primaryAsset}
                  </ListItemText>
                
              </ListItem>
            </List>
            <Collapse in={openPrimary}>
              <Box m={2}>
                <Typography variant="body2" component="p">
                  {primaryAsset}
                </Typography>
              </Box>
            </Collapse>
            <List component="div">
              <ListItem>
                <IconButton edge="start" color="inherit" aria-label="edit" onClick={handleExperienceAssets}>
                  <EditIcon />
                </IconButton>
                  <ListItemText>
                    <em>Experience asset - </em> {experienceAsset}
                  </ListItemText>
              </ListItem>
            </List>
            <Collapse in={openExperience}>
              <Box m={2}>
                <Typography variant="body2" component="p">
                  {experienceAsset}
                </Typography>
              </Box>
            </Collapse>
          </Collapse>
        </List>

        <Typography variant="h4">Library</Typography>
        {libraryFields.map((lib, index) => (
          <>
            {' '}
            Library {index + 1}
            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="ID"
                    variant="outlined"
                    name="library_id"
                    value={lib.library_id}
                    onChange={(evt) => handleLibraryChange(index, evt)}
                  />
                </Item>
              </Grid>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="Title"
                    variant="outlined"
                    name="title"
                    value={lib.title}
                    onChange={(evt) => handleAppsChange(index, evt)}
                  />
                </Item>
              </Grid>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="Location Type"
                    variant="outlined"
                    name="location_type"
                    value={lib.location_type}
                    onChange={(evt) => handleLibraryChange(index, evt)}
                  />
                </Item>
              </Grid>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="Location"
                    variant="outlined"
                    name="location"
                    value={lib.location}
                    onChange={(evt) => handleLibraryChange(index, evt)}
                  />
                </Item>
              </Grid>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="COntent Type"
                    variant="outlined"
                    name="content_type"
                    value={lib.content_type}
                    onChange={(evt) => handleLibraryChange(index, evt)}
                  />
                </Item>
              </Grid>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="COntent Hash"
                    variant="outlined"
                    name="content_hash"
                    value={lib.content_hash}
                    onChange={(evt) => handleLibraryChange(index, evt)}
                  />
                </Item>
              </Grid>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="Size"
                    variant="outlined"
                    name="size"
                    value={lib.size}
                    onChange={(evt) => handleLibraryChange(index, evt)}
                  />
                </Item>
              </Grid>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="Sort"
                    variant="outlined"
                    name="sort"
                    value={lib.sort}
                    onChange={(evt) => handleLibraryChange(index, evt)}
                  />
                </Item>
              </Grid>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="Read"
                    variant="outlined"
                    name="read"
                    value={lib.read}
                    onChange={(evt) => handleLibraryChange(index, evt)}
                  />
                </Item>
              </Grid>
            </Grid>
          </>
        ))}
      </Box>
    </div>
  );
};

export default NewForm;
