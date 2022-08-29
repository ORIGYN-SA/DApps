import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Grid, Divider } from '@mui/material';
import pick from 'lodash/pick';
const FormTab = ({ metadata }: any) => {
  console.log(metadata);

  const [owner, setOwner] = useState('');
  const [hiddenAsset, setHiddenAsset] = useState('');
  const [previewAsset, setPreviewAsset] = useState('');
  const [primaryAsset, setPrimaryAsset] = useState('');
  const [experienceAsset, setExperienceAsset] = useState('');
  const [id, setId] = useState('');
  const [apps, setApps] = useState([]);
  const [library, setLibrary] = useState([]);
  useEffect(() => {
    if (Object.entries(metadata).length) {
      setOwner(pick(metadata, ['owner']).owner);
      setHiddenAsset(pick(metadata, ['hidden_asset']).hidden_asset);
      setPreviewAsset(pick(metadata, ['preview_asset']).preview_asset);
      setPrimaryAsset(pick(metadata, ['primary_asset']).primary_asset);
      setExperienceAsset(pick(metadata, ['experience_asset']).experience_asset);
      setId(pick(metadata, ['id']).id);
      setApps(pick(metadata, ['__apps']).__apps);
      setLibrary(pick(metadata, ['library']).library);
    }
  }, [metadata]);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          Info
        </Grid>
        <Grid item xs={10}>
          <List>
            <ListItem secondaryAction={<ListItemText primary={owner} />}>
              <ListItemText primary={'owner'} />
            </ListItem>
            <Divider />
            <ListItem secondaryAction={<ListItemText primary={hiddenAsset} />}>
              <ListItemText primary={'hidden_asset'} />
            </ListItem>
            <Divider />
            <ListItem secondaryAction={<ListItemText primary={previewAsset} />}>
              <ListItemText primary={'preview_asset'} />
            </ListItem>
            <Divider />
            <ListItem secondaryAction={<ListItemText primary={primaryAsset} />}>
              <ListItemText primary={'primary_asset'} />
            </ListItem>
            <Divider />
            <ListItem secondaryAction={<ListItemText primary={experienceAsset} />}>
              <ListItemText primary={'experience_asset'} />
            </ListItem>
            <Divider />
            <ListItem secondaryAction={<ListItemText primary={id} />}>
              <ListItemText primary={'id'} />
            </ListItem>
          </List>
        </Grid>
      </Grid>
      <Divider />
      {apps?.map((app, i) => {
        return (
          <Grid sx={{ marginTop: '20px' }} container spacing={2} key={`${app}+${i}`}>
            <Grid item xs={2}></Grid>
            <Grid item xs={2} >{`app ${i + 1}`}</Grid>
            <Grid item xs={8}>
              <List>
                <ListItem secondaryAction={<ListItemText primary={app.app_id} />}>
                  <ListItemText primary={'app_id'} />
                </ListItem>
                <Divider />
                <ListItem secondaryAction={<ListItemText primary={app.read} />}>
                  <ListItemText primary={'read'} />
                </ListItem>
                <Divider />

                <ListItem
                  secondaryAction={
                    <List>
                      <ListItem secondaryAction={<ListItemText primary={app.write.type} />}>
                        <ListItemText primary={'type'} />
                      </ListItem>{' '}
                      <Divider />
                      {app.write.list.map((item) => (
                        <ListItem key={`${item}+${i}`}>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  }
                >
                  <ListItemText
                    sx={{ height: `${app.write.list.length * 50 + 50}px` }}
                    primary={'write'}
                  />
                </ListItem>
                <Divider />

                <ListItem
                  secondaryAction={
                    <List sx={{}}>
                      <ListItem secondaryAction={<ListItemText primary={app.permissions.type} />}>
                        <ListItemText primary={'type'} />
                      </ListItem>{' '}
                      <Divider />
                      {app.permissions.list.map((item) => (
                        <ListItem key={`${item}}+${i}`}>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  }
                >
                  <ListItemText
                    sx={{ height: `${app.permissions.list.length * 50 + 50}px` }}
                    primary={'permissions'}
                  />
                </ListItem>
                <Divider />

                <ListItem
                  secondaryAction={
                    <List  sx={{ width: '700px' }}>
                      {Object.keys(app.data).map((item, i) => (
                        <div key={i}>
                          {' '}
                          <ListItem
                            secondaryAction={
                              <ListItemText sx={{ width: '300px' }} primary={app.data[item]} />
                            }
                          >
                            <ListItemText sx={{}} primary={item} />
                          </ListItem>
                          {i < Object.keys(app.data).length - 1 ? <Divider /> : null}
                        </div>
                      ))}
                      {}
                    </List>
                  }
                >
                  <ListItemText
                    sx={{ height: `${Object.keys(app.data).length * 50}px` }}
                    primary={'data'}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        );
      })}
      <Divider />
      {library?.map((lib, i) => {
        let length = Object.keys(lib).length;
        return (
          <Grid key={`${lib}+${i}`} sx={{ marginTop: '20px' }} container spacing={2}>
            <Grid item xs={2}></Grid>
            <Grid item xs={2}>{`library ${i + 1}`}</Grid>
            <Grid item xs={8}>
              <List>
                {Object.keys(lib).map((item, j) => (
                  <div key={j}>
                    <ListItem secondaryAction={<ListItemText primary={lib[item]} />}>
                      <ListItemText primary={item} />
                    </ListItem>
                    {j < length - 1 ? <Divider /> : null}
                  </div>
                ))}
              </List>
            </Grid>
          </Grid>
        );
      })}
    </div>
  );
};

export default FormTab;
