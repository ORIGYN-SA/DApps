import React from 'react';
import Box from '@mui/material/Box';
import LibraryAccordion from '../../components/LibraryAccordion';
import TreeviewPart from '../../components/TreeviewPart';

const Library = () => {
  return (
    <Box>
      <TreeviewPart>
        <LibraryAccordion />
      </TreeviewPart>
    </Box>
  );
};

export default Library;
