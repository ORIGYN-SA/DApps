import React from "react";
import Box from '@mui/material/Box';
import LibraryAccordion from "../../components/LibraryAccordion";
import Treeview from "../../components/Treeview";

const Library = () => {

  return (  
        <Box
          sx={{ m: 2,p: 2}}>
            <LibraryAccordion/>
            <Treeview/>     
        </Box>
  );
};

export default Library;