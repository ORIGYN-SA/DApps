import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { TreeItem } from '@mui/lab';
import LibraryBox from '../LibraryBox';

const NFTLibrary = (props: any) => {
  const [libraryData, setLibraryData] = useState<Array<any>>([]);
  const [currentLibrary, setCurrentLibrary] = useState([]);
  const { actor } = useContext(AuthContext);

  let signed = {
    id: props.currentNft,
  };

  useEffect(() => {
    if (actor) {
      actor.nft_origyn(signed.id).then((r) => {
        console.log('nft_origyn NFTLibrary', r);
        setLibraryData(
          r.ok.metadata.Class.filter((res) => {
            return res.name === 'library';
          })[0].value.Array.thawed,
        );
      });
    }
  }, [actor]);

  return (
    <div>
      {libraryData?.map((library) => (
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

export default NFTLibrary;
