import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import LibraryBox from '../LibraryBox';
import { getNft } from '@origyn-sa/mintjs';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import Collapse from '@mui/material/Collapse';

const LibraryAccordion = () => {
  const { tokenId, actor } = useContext(AuthContext);
  const [libData, setLibData] = useState([]);
  const [currentLibrary, setCurrentLibrary] = useState();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
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
    <div>
      <List>
        {libData?.map((library, index) => (
          <ListItem
            key={index}
            sx={{
              border: '1px solid black',
            }}
          >
            <ListItemButton
              onClick={() => {
                setCurrentLibrary(library);
                handleClick();
              }}
            >
              <ListItemText primary={library?.Class[0]?.value?.Text} />
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <LibraryBox currentLibrary={currentLibrary} />
            </Collapse>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
export default LibraryAccordion;
