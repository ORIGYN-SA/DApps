import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import LibraryBox from '../LibraryBox';
import { TreeItem } from '@mui/lab';
import { getNft } from '@origyn-sa/mintjs';

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
      {libData?.map((library) => (
        <TreeItem
          key={library?.Class[0]?.value?.Text}
          nodeId={library?.Class[0]?.value?.Text}
          label={library?.Class[1]?.value?.Text}
          onClick={() => setCurrentLibrary(library)}
        >
          <LibraryBox currentLibrary={currentLibrary} />
        </TreeItem>
      ))}
    </div>
  );
};
export default LibraryAccordion;
