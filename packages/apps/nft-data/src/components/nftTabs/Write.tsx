import React from 'react';
import { CandyDataEditor } from '@dapp/candy-editor';
import { Container } from '@origyn-sa/origyn-art-ui';
import { CandyClass, CandyEditor } from './types/origyn_nft_reference.did';

const FormTab = () => {
  const currentCandyClass: CandyClass = {
    Class: [
      {
        name: 'Text Candy',
        immutable: false,
        value: {
          Text: 'test',
        },
      },
      {
        name: 'Nat Candy',
        immutable: false,
        value: {
          Nat: 1000000n,
        },
      },
      {
        name: 'Bool Candy - immutable',
        immutable: true,
        value: {
          Bool: true,
        },
      },
    ],
  };

  return (
    <Container padding="16px">
      <CandyDataEditor existingCandyClass={currentCandyClass} />
    </Container>
  );
};

export default FormTab;
