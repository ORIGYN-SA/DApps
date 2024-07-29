import React, { useEffect, useState } from 'react';
import pick from 'lodash/pick';
import { Container, HR, Grid, Flex } from '@origyn/origyn-art-ui';

const FormTab = ({ metadata }: any) => {
  const [owner, setOwner] = useState('');
  const [hiddenAsset, setHiddenAsset] = useState('');
  const [previewAsset, setPreviewAsset] = useState('');
  const [primaryAsset, setPrimaryAsset] = useState('');
  const [experienceAsset, setExperienceAsset] = useState('');
  const [id, setId] = useState('');
  const [apps, setApps] = useState<any[]>([]);
  const [library, setLibrary] = useState([]);
  const [system, setSystem] = useState([]);
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
      setSystem(pick(metadata, ['__system']).__system);
    }
  }, [metadata]);

  return (
    <Container padding="16px">
      <Grid columns={3}>
        <Grid columns={1}>
          <h3>Info</h3>
        </Grid>
        <Grid columns={2}>
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <b>
              <span>{'owner'}</span>
            </b>
            <span>{owner}</span>
          </Flex>
          <HR marginTop={4} marginBottom={4} />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <b>
              <span>{'hidden_asset'}</span>
            </b>
            <span>{hiddenAsset}</span>
          </Flex>
          <HR marginTop={4} marginBottom={4} />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <b>
              <span>{'preview_asset'}</span>
            </b>
            <span>{previewAsset}</span>
          </Flex>
          <HR marginTop={4} marginBottom={4} />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <b>
              <span>{'primary_asset'}</span>
            </b>
            <span>{primaryAsset}</span>
          </Flex>
          <HR marginTop={4} marginBottom={4} />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <b>
              <span>{'experience_asset'}</span>
            </b>
            <span>{experienceAsset}</span>
          </Flex>
          <HR marginTop={4} marginBottom={4} />
          <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
            <b>
              <span>{'id'}</span>
            </b>
            <span>{id}</span>
          </Flex>
          <HR marginTop={4} marginBottom={4} />
        </Grid>
      </Grid>
      <HR marginTop={32} marginBottom={32} />
      {apps?.map((app, appIndex) => (
        <Grid columns={3} key={`app-${appIndex}`}>
          <Grid columns={1}>
            <h3>{'Data'}</h3>
          </Grid>
          <Grid columns={2}>
            <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
              <b>
                <span>{'app_id'}</span>
              </b>
              <span>{app.app_id}</span>
            </Flex>
            <HR marginTop={4} marginBottom={4} />
            <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
              <b>
                <span>{'read'}</span>
              </b>
              <span>{app.read}</span>
            </Flex>
            <HR marginTop={4} marginBottom={4} />
            <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
              <b>
                <span>{'type'}</span>
              </b>
              <span>{app.write.type}</span>
            </Flex>
            <HR marginTop={4} marginBottom={4} />
            {app.write.list.map((item, writeIndex) => (
              <Flex
                flexFlow="row"
                gap={32}
                padding={16}
                justify="space-between"
                key={`write-${appIndex}-${writeIndex}`}
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
            <HR marginTop={4} marginBottom={4} />
            {app.permissions.list.map((item, permIndex) => (
              <Flex
                flexFlow="row"
                gap={32}
                padding={16}
                justify="space-between"
                key={`perm-${appIndex}-${permIndex}`}
              >
                <b>
                  <span>{'permissions'}</span>
                </b>
                <span>{item} </span>
              </Flex>
            ))}

            {Object.keys(app.data).map((item, propIndex) => (
              <React.Fragment key={`prop-${appIndex}-${propIndex}`}>
                {' '}
                <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                  <b>
                    {' '}
                    <span>{item} </span>
                  </b>

                  <span>{JSON.stringify(app.data[item])}</span>
                </Flex>
                {propIndex < Object.keys(app.data).length - 1 ? (
                  <HR key={`prop-hr-${appIndex}-${propIndex}`} />
                ) : null}
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ))}
      <HR marginTop={32} marginBottom={32} />

      <Grid columns={3}>
        <Grid columns={1}>
          <h3>System</h3>
        </Grid>
        <Grid columns={2}>
          {Object.keys(system).map((item, propIndex) => (
            <React.Fragment key={`system-${propIndex}`}>
              <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                <b>
                  <span>{item}</span>
                </b>
                <span>{system[item]}</span>
              </Flex>
            </React.Fragment>
          ))}
        </Grid>
      </Grid>
      <HR marginTop={32} marginBottom={32} />
      <Flex flexFlow="row" gap={32} padding={16} align="flex-start">
        <h3>Libraries</h3>
      </Flex>
      {library?.map((lib, libraryIndex) => (
        <>
          <HR marginTop={4} marginBottom={4} />
          <Grid key={`library-${libraryIndex}`} columns={3}>
            <Grid columns={1}></Grid>
            <Grid columns={2}>
              {Object.keys(lib).map((item, propIndex) => (
                <React.Fragment key={`library-${libraryIndex}-${propIndex}`}>
                  <Flex flexFlow="row" gap={32} padding={16} justify="space-between">
                    <b>
                      <span>{item}</span>
                    </b>
                    <span>{lib[item]}</span>
                  </Flex>

                  {propIndex < Object.keys(lib).length - 1 ? (
                    <HR key={`library-hr-${libraryIndex}-${propIndex}`} />
                  ) : null}
                </React.Fragment>
              ))}
            </Grid>
          </Grid>
        </>
      ))}
    </Container>
  );
};

export default FormTab;
