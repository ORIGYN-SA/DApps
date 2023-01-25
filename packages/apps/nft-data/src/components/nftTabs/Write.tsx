import React from 'react';
import { CandyDataEditor } from '@dapp/candy-editor';
import { Container } from '@origyn-sa/origyn-art-ui';

const RawTab = ({ metadata }: any) => {
  return (
    <Container padding="16px">
      <CandyDataEditor />
    </Container>
  );
};

export default RawTab;
