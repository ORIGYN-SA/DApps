import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import pick from 'lodash/pick';
import { Container, HR, Grid } from '@origyn-sa/origyn-art-ui'

const FormTab = ({ metadata }: any) => {

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
      console.log('metadata is ', metadata);
    }
  }, [metadata]);

  return (
    <Container padding="16px">
      <Grid columns={3}>
        <Grid column={1}>
          Info
        </Grid>
        <Grid column={2}>
          <List>
            <ListItem secondaryAction={<ListItemText primary={owner} />}>
              <ListItemText primary={'owner'} />
            </ListItem>
            <HR />
            <ListItem secondaryAction={<ListItemText primary={hiddenAsset} />}>
              <ListItemText primary={'hidden_asset'} />
            </ListItem>
            <HR />
            <ListItem secondaryAction={<ListItemText primary={previewAsset} />}>
              <ListItemText primary={'preview_asset'} />
            </ListItem>
            <HR />
            <ListItem secondaryAction={<ListItemText primary={primaryAsset} />}>
              <ListItemText primary={'primary_asset'} />
            </ListItem>
            <HR />
            <ListItem secondaryAction={<ListItemText primary={experienceAsset} />}>
              <ListItemText primary={'experience_asset'} />
            </ListItem>
            <HR />
            <ListItem secondaryAction={<ListItemText primary={id} />}>
              <ListItemText primary={'id'} />
            </ListItem>
          </List>
        </Grid>
      </Grid>
      <HR />
      {apps?.map((app, i, index) => {
        return (
          <Grid sx={{ marginTop: '20px' }} container spacing={2} key={`${app}+${index}`}>
            <Grid item xs={2}></Grid>
            <Grid item xs={2} sx={{}}>{`app ${i + 1}`}</Grid>
            <Grid item xs={8}>
              <List>
                <ListItem secondaryAction={<ListItemText primary={app.app_id} />}>
                  <ListItemText primary={'app_id'} />
                </ListItem>
                <HR />
                <ListItem secondaryAction={<ListItemText primary={app.read} />}>
                  <ListItemText primary={'read'} />
                </ListItem>
                <HR />
                <ListItem
                  secondaryAction={
                    <List sx={{}}>
                      <ListItem secondaryAction={<ListItemText primary={app.write.type} />}>
                        <ListItemText primary={'type'} />
                      </ListItem>{' '}
                      <HR />
                      {app.write.list.map((item) => (
                        <ListItem key={`${item}+${index}`}>
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
                <HR />

                <ListItem
                  secondaryAction={
                    <List sx={{}}>
                      <ListItem secondaryAction={<ListItemText primary={app.permissions.type} />}>
                        <ListItemText primary={'type'} />
                      </ListItem>{' '}
                      <HR />
                      {app.permissions.list.map((item) => (
                        <ListItem key={`${item}}+${index}`}>
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
                <HR />
                <ListItem
                  secondaryAction={
                    <List sx={{ width: '700px' }}>
                      {Object.keys(app.data).map((item, i) => (
                        <>
                          {' '}
                          <ListItem
                            secondaryAction={
                              <ListItemText sx={{ width: '300px' }} primary={JSON.stringify(app.data[item])} />
                            }
                          >
                            <ListItemText sx={{}} primary={item} />
                          </ListItem>
                          {i < Object.keys(app.data).length - 1 ? <HR /> : null}
                        </>
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
      <HR />
      {library?.map((lib, i, index) => {
        let length = Object.keys(lib).length;
        return (
          <Grid key={`${lib}+${index}`} sx={{ marginTop: '20px' }} container spacing={2}>
            <Grid item xs={2}></Grid>
            <Grid item xs={2} sx={{}}>{`library ${i + 1}`}</Grid>
            <Grid item xs={8}>
              <List>
                {Object.keys(lib).map((item, j) => (
                  <>
                    <ListItem secondaryAction={<ListItemText primary={lib[item]} />}>
                      <ListItemText primary={item} />
                    </ListItem>
                    {j < length - 1 ? <HR /> : null}
                  </>
                ))}
              </List>
            </Grid>
          </Grid>
        );
      })}
    </Container>
  );
};

export default FormTab;
