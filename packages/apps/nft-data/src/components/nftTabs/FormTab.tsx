import React, { useEffect, useState } from 'react';
import pick from 'lodash/pick';
import { Container, HR, Grid, Flex } from '@origyn-sa/origyn-art-ui';

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
        <Grid column={1}>Info</Grid>
        <Grid column={2}>
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <span>{'owner'}</span>
            <span>{owner}</span>
          </Flex>
          <HR />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <span>{'hidden_asset'}</span>
            <span>{hiddenAsset}</span>
          </Flex>
          <HR />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <span>{'preview_asset'}</span>
            <span>{previewAsset}</span>
          </Flex>
          <HR />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <span>{'primary_asset'}</span>
            <span>{primaryAsset}</span>
          </Flex>
          <HR />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <span>{'experience_asset'}</span>
            <span>{experienceAsset}</span>
          </Flex>
          <HR />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <span>{'owner'}</span>
            <span>{owner}</span>
          </Flex>
          <HR />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <span>{'id'}</span>
            <span>{id}</span>
          </Flex>
          <HR />
        </Grid>
      </Grid>
      <HR />
      {apps?.map((app, i, index) => {
        return (
          <Grid sx={{ marginTop: '20px' }} container spacing={2} key={`${app}+${index}`}>
            <Grid item xs={2}></Grid>
            <Grid item xs={2} sx={{}}>{`app ${i + 1}`}</Grid>
            <Grid item xs={8}>

                <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                  <span>{'app_id'}</span>
                  <span>{app.app_id}</span>
                </Flex>
                <HR />

                <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                  <span>{'read'}</span>
                  <span>{app.read}</span>
                </Flex>
                <HR />

                <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                  <span>{'type'}</span>
                  <span>{app.write.type}</span>
                </Flex>
                <HR />
                {app.write.list.map((item) => (
                  <Flex
                    flexFlow="row"
                    gap={32}
                    padding={16}
                    justify="space-between"
                    key={`${item}+${index}`}
                  >
                    <span>{item}</span>
                  </Flex>
                ))}

                <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                  <span>{'write'}</span>
                </Flex>
                <HR />

                <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                  <span>{'type'}</span>
                  <span>{app.permissions.type}</span>
                </Flex>

                <HR />
                {app.permissions.list.map((item) => (
                  <Flex
                    flexFlow="row"
                    gap={32}
                    padding={16}
                    justify="space-between"
                    key={`${item}+${index}`}
                  >
                    <span>{item} </span>
                  </Flex>
                ))}

                <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                  <span>{'permissions'}</span>
                </Flex>

                <HR />
                {/* //------------------------------- */}
                      {Object.keys(app.data).map((item, i) => (
                        <>
                          {' '}
                          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">

                              <span>{JSON.stringify(app.data[item])}</span>
                              

                            <span>{item} </span>
                          </Flex>
                          {i < Object.keys(app.data).length - 1 ? <HR /> : null}
                        </>
                      ))}
                           
                  <span>{'data'}</span>

                {/* //----------------------- */}




            </Grid>
          </Grid>
        );
      })}
      <HR />


      {library?.map((lib, i, index) => {
        let length = Object.keys(lib).length;
        return (
          <Grid key={`${lib}+${index}`} columns={1}>
            <Grid icolumn={1}>
                {Object.keys(lib).map((item, j) => (
                  <>
                   <Flex flexFlow="row" gap={32} padding={16} justify="space-around">
                    <span>{lib[item]}</span>
                    <span>{item}</span>
                    </Flex>

                    {j < length - 1 ? <HR /> : null}
                  </>
                ))}
            </Grid>
          </Grid>
        );
      })}
    </Container>
  );
};

export default FormTab;
