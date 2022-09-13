import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import LibraryBox from '../LibraryBox';
import { getNft } from '@origyn-sa/mintjs';
import { List, ListItemText, ListItemButton } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const LibraryAccordion = () => {
  const { tokenId, actor } = useContext(AuthContext);
  const [libData, setLibData] = useState([]);
  const [library, setLibrary] = useState();
  const [openDub, setOpenDub] = useState(false);

  const handleClick = (lib) => {
    setOpenDub(!open);
    setLibrary(lib);
  };

  useEffect(() => {
    if (actor) {
      getNft(tokenId)
        .then((r) => {
          console.log(r);
          setLibData(
            r.ok.metadata.Class.filter((res) => {
              return res.name === 'library';
            })[0].value.Array.thawed,
          );
          console.log('asta ii Rv', r);
        })
        .catch(console.log);
    }
  }, [actor]);

  return (
    <List sx={{ padding: 0 }}>
      {libData?.map((library, index) => (
        <ListItemButton
          key={index}
          sx={{
            border: '1px solid black',
          }}
          onClick={() => {
            handleClick(library);
          }}
        >
          <ListItemText primary={library?.Class[0]?.value?.Text} />
          {openDub ? <ChevronLeft /> : <ChevronRight />}
        </ListItemButton>
      ))}
      <Collapse in={openDub} timeout="auto" unmountOnExit>
        <LibraryBox library={library} />
      </Collapse>
    </List>
  );
};
export default LibraryAccordion;
