import React from 'react';
import { JsonToTable } from 'react-json-to-table';
import { Container } from '@origyn-sa/origyn-art-ui';

const RawTab = ({ metadata }: any) => {
  return (
    <Container padding="16px">
      <div>
      <JsonToTable 
      json={metadata} />
      </div>
    </Container>
  );
};

export default RawTab;
