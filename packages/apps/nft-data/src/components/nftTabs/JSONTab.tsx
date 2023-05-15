import React from 'react';
import { Container } from '@origyn/origyn-art-ui';

const JSONTab = ({ metadata }: any) => {
  return (
    <Container padding="16px">
      <pre>{JSON.stringify(metadata, null, 2)}</pre>
    </Container>
  );
};

export default JSONTab;
