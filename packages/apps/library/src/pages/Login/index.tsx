import React from 'react';
import Box from '@mui/material/Box';
import LibraryAccordion from '../../components/LibraryAccordion';
import TreeviewPart from '../../components/TreeviewPart';
import { SwitchCanisterCollection } from '@dapp/features-components';

const Library = () => {
  return (
    <Box>
      <div style = {{ width:"95%", marginBottom: "2rem", marginTop: "2rem"}}>
      <SwitchCanisterCollection/>
      </div>
      <TreeviewPart>
        <LibraryAccordion />
      </TreeviewPart>
    </Box>
  );
};

export default Library;
