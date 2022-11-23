import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container'
import ColumnView from '../../components/ColumnView';
import { SwitchCanisterCollection } from '@dapp/features-components';

const Library = () => {
  return (
    <Container maxWidth="xl">
      <Box>
        <SwitchCanisterCollection />
        <ColumnView />
      </Box>
    </Container>
  );
};

export default Library;
