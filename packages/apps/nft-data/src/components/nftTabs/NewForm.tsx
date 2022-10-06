import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import pick from 'lodash/pick';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const NewForm = ({ metadata }: any) => {
  console.log(metadata);

  const [owner, setOwner] = useState('');
  const [hiddenAsset, setHiddenAsset] = useState('');
  const [previewAsset, setPreviewAsset] = useState('');
  const [primaryAsset, setPrimaryAsset] = useState('');
  const [experienceAsset, setExperienceAsset] = useState('');
  const [id, setId] = useState('');
  const [apps, setApps] = useState([
    /* {app_id: '', read: '', write: { type: '', list: []}, permissions: { type: '', list: []}, data: {
      'com.bm.sample.app.name': '',
      'com.bm.sample.app.total_in_collection': '',
                'com.bm.sample.app.creator_name': '',
                'com.bm.sample.app.creator_principal': ''
    }} */
  ]);

  const [library, setLibrary] = useState([]);
  const [libraryFields, setLibraryFields] = useState([
    /*   {library_id: '', title: '', location_type: '', location: '', content_type: '', content_hash: '', size: '', sort: '', read: ''} */
  ]);

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
      /* setLibrary(pick(metadata, ['library']).library); */
      setLibraryFields(pick(metadata, ['library']).library);
    }
  }, [metadata]);

  // <----------------------------

  const { tokenId, canisterId, principal, actor } = useContext(AuthContext);
  const [data, setData] = useState();

  const submitData = async () => {
    console.log('this is data', data);
    await actor.update_app_nft_origyn({
      replace: {
        token_id: tokenId,
        data: data,
      },
    });
  };

  const inputData = (evt, index) => {
    handleAppsChange(index, evt);
    setData(evt);
  };

  //   <Button variant="contained" onClick={submitData}> Save </Button>
  // <--------------------------------

  return (
    <div>
      <Box>
        <Typography variant="h4">Apps</Typography>
        {apps.map((app, index) => (
          <>
            {' '}
            App {index + 1}
            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
              <Grid xs={6} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="App ID"
                    variant="outlined"
                    name="app_id"
                    value={app.app_id}
                    onChange={(evt) => inputData(evt, index)}
                  />
                  <Button variant="contained" onClick={submitData}>
                    {' '}
                    Save{' '}
                  </Button>
                </Item>
              </Grid>
              <Grid xs={6} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="Read"
                    variant="outlined"
                    name="read"
                    value={app.read}
                    onChange={(evt) => inputData(evt, index)}
                  />
                  <Button variant="contained" onClick={submitData}>
                    {' '}
                    Save{' '}
                  </Button>
                </Item>
              </Grid>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  <Typography variant="h4">{'Write'}</Typography>
                </Item>
              </Grid>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="Type"
                    variant="outlined"
                    name="write_type"
                    value={app.write.type}
                    onChange={(evt) => handleAppsChange(index, evt)}
                  />
                </Item>
              </Grid>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  {app.write.list.map((item, i) => (
                    <TextField
                      label="List"
                      variant="outlined"
                      name="write_list"
                      value={app.write.list[i]}
                      onChange={(evt) => handleAppsChange(index, evt, i)}
                    />
                  ))}
                </Item>
              </Grid>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  <Typography variant="h4">{'Permissions'}</Typography>
                </Item>
              </Grid>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="Type"
                    variant="outlined"
                    name="permissions_type"
                    value={app.permissions.type}
                    onChange={(evt) => handleAppsChange(index, evt)}
                  />
                </Item>
              </Grid>
              <Grid xs={4} sx={{ marginTop: '10px' }}>
                <Item>
                  {app.permissions.list.map((item, i) => (
                    <TextField
                      label="List"
                      variant="outlined"
                      name="permissions_list"
                      value={app.permissions.list[i]}
                      onChange={(evt) => handleAppsChange(index, evt, i)}
                    />
                  ))}
                </Item>
              </Grid>
              <Grid xs={12} sx={{ marginTop: '10px' }}>
                <Item>
                  <Typography variant="h4">{'Data'}</Typography>
                </Item>
              </Grid>
              <Grid xs={3} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="Name"
                    variant="outlined"
                    name="com.bm.sample.app.name"
                    value={app.data['com.bm.sample.app.name']}
                    onChange={(evt) => handleAppsChange(index, evt)}
                  />
                </Item>
              </Grid>
              <Grid xs={3} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="Total"
                    variant="outlined"
                    name="com.bm.sample.app.total_in_collection"
                    value={app.data['com.bm.sample.app.total_in_collection']}
                    onChange={(evt) => handleAppsChange(index, evt)}
                  />
                </Item>
              </Grid>
              <Grid xs={3} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="Creator Name"
                    variant="outlined"
                    name="com.bm.sample.app.creator_name"
                    value={app.data['com.bm.sample.app.creator_name']}
                    onChange={(evt) => handleAppsChange(index, evt)}
                  />
                </Item>
              </Grid>
              <Grid xs={3} sx={{ marginTop: '10px' }}>
                <Item>
                  <TextField
                    label="Principal"
                    variant="outlined"
                    name="com.bm.sample.app.creator_principal"
                    value={app.data['com.bm.sample.app.creator_principal']}
                    onChange={(evt) => handleAppsChange(index, evt)}
                  />
                </Item>
              </Grid>
            </Grid>
          </>
        ))}
      </Box>
      <Box>
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
