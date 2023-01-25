import React from 'react';
import { Container } from '@origyn-sa/origyn-art-ui';

const JSONTab = ({ metadata }: any) => {
  console.log(metadata);

  return (
    <Container padding="16px">
      <pre>{JSON.stringify(metadata, null, 2)}</pre>
    </Container>
  );
};

export default JSONTab;
