import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import LibraryBox from '../LibraryBox';
import { getNft } from '@origyn-sa/mintjs';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';

const LibraryAccordion = () => {
  const { tokenId, actor } = useContext(AuthContext);
  const [libData, setLibData] = useState([]);
  const [currentLibrary, setCurrentLibrary] = useState();

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
          <ListItem key={index}>

            <ListItemButton  onClick={() => setCurrentLibrary(library)}>
              <ListItemText   primary={library?.Class[0]?.value?.Text} />
              <LibraryBox currentLibrary={currentLibrary} /> 
            </ListItemButton>

            </ListItem>

        ))}
      </List>
    </div>
  );
};
export default LibraryAccordion;
