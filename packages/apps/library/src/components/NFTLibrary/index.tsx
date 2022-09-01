import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { TreeItem } from '@mui/lab';
import LibraryBox from '../LibraryBox';

const NFTLibrary = (props: any) => {
  const { libraryData, setLibraryData } = useState([]);
  const [currentLibrary, setCurrentLibrary] = useState();
  const { actor } = useContext(AuthContext);

  let signed = {
    id: props.currentNft,
  };

  const nftLibrariesData = async () => {
    const lib = await actor?.nft_origyn(signed.id);
    console.log('here is library of NFT', lib);
    return setLibraryData(
      lib.ok.metadata.Class.filter((res) => {
        return res.name === 'library';
      })[0].value.Array.thawed,
    );
  };

  useEffect(() => {
    if (actor) {
      nftLibrariesData();
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
