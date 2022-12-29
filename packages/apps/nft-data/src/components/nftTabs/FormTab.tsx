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
        <Grid column={1}>
          <h3>Info</h3>
        </Grid>
        <Grid column={2}>
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <b>
              <span>{'owner'}</span>
            </b>
            <span>{owner}</span>
          </Flex>
          <HR />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <b>
              <span>{'hidden_asset'}</span>
            </b>
            <span>{hiddenAsset}</span>
          </Flex>
          <HR />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <b>
              <span>{'preview_asset'}</span>
            </b>
            <span>{previewAsset}</span>
          </Flex>
          <HR />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <b>
              <span>{'primary_asset'}</span>
            </b>
            <span>{primaryAsset}</span>
          </Flex>
          <HR />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <b>
              <span>{'experience_asset'}</span>
            </b>
            <span>{experienceAsset}</span>
          </Flex>
          <HR />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <b>
              <span>{'id'}</span>
            </b>
            <span>{id}</span>
          </Flex>
          <HR />
        </Grid>
      </Grid>
      <HR />
      <br />
      <br />
      {apps?.map((app, i, index) => {
        return (
          <Grid columns={3} key={`${app}+${index}`}>
            <Grid column={1}>
              <h3>{'data'}</h3>
            </Grid>
            <Grid column={2}>
              <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                <b>
                  <span>{'app_id'}</span>
                </b>
                <span>{app.app_id}</span>
              </Flex>
              <HR />

              <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                <b>
                  <span>{'read'}</span>
                </b>
                <span>{app.read}</span>
              </Flex>
              <HR />

              <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                <b>
                  <span>{'type'}</span>
                </b>
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
                  <b>
                    <span>{'write'}</span>
                  </b>
                  <span>{item}</span>
                </Flex>
              ))}

              <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                <b>
                  <span>{'type'}</span>
                </b>
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
                  <b>
                    <span>{'permissions'}</span>
                  </b>
                  <span>{item} </span>
                </Flex>
              ))}

              <br />
              <br />
              {/* //------------------------------- */}

              <br />
              {Object.keys(app.data).map((item, i) => (
                <>
                  {' '}
                  <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                    <b>
                      {' '}
                      <span>{item} </span>
                    </b>

                    <span>{JSON.stringify(app.data[item])}</span>
                  </Flex>
                  {i < Object.keys(app.data).length - 1 ? <HR /> : null}
                </>
              ))}

              <br />
              <br />

              {/* //----------------------- */}
            </Grid>
          </Grid>
        );
      })}
      <HR />
      <br/>
      <br/>

      <Flex flexFlow="row" gap={32} padding={16} align="flex-start">
        <h3>Libraries</h3>
      </Flex>


      {library?.map((lib, i, index) => {
        let length = Object.keys(lib).length;
        return (
          <Grid key={`${lib}+${index}`} columns={3}>
            <Grid column={1}></Grid>
            <Grid column={2}>
              {Object.keys(lib).map((item, j) => (
                <>
                  <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                    <b>
                      <span>{item}</span>
                    </b>
                    <span>{lib[item]}</span>
                  </Flex>

                  {j < length - 1 ? <HR /> : null}
                </>
              ))}
              <br />
              <br />
            </Grid>
          </Grid>
        );
      })}
    </Container>
  );
};

export default FormTab;
