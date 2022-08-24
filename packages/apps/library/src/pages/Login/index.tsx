import React from "react";
import Box from '@mui/material/Box';
import LibraryAccordion from "../../components/LibraryAccordion";
import TreeviewPart from "../../components/TreeviewPart";

const Library = () => {

  return (  
        <Box
          sx={{ m: 2,p: 2}}>
            <LibraryAccordion/>
            <TreeviewPart/>     
        </Box>
  );
};

export default Library;