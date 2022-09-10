import React from 'react';
import Box from '@mui/material/Box';
import LibraryAccordion from '../../components/LibraryAccordion';
import ColumnView from '../../components/ColumnView';
import { SwitchCanisterCollection } from '@dapp/features-components';

const Library = () => {
  return (
    <Box>
      <div style = {{ width:"95%", marginBottom: "2rem", marginTop: "2rem"}}>
      <SwitchCanisterCollection/>
      </div>
      <ColumnView>
        <LibraryAccordion />
      </ColumnView>
    </Box>
  );
};

export default Library;
