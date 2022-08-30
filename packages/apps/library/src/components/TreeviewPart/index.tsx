import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import LibraryBox from '../LibraryBox';

const TreeViewPart = ({ children }: any) => {
  const { actor, canisterId } = useContext(AuthContext);
  const [nfts, setNfts] = useState([]);
  const [currentNft, setCurrentNft] = useState();

  const nftCollection = async () => {
    const response = await actor?.collection_nft_origyn([]);
    console.log("asta-i ma", response);
    const collectionNFT = response.ok;
    const obj_token_ids = collectionNFT.token_ids;

    const arrayTokenIds = [];
    for (var x in obj_token_ids) {
      var newID = obj_token_ids[x];
      arrayTokenIds.push(newID);
    }

    return setNfts(arrayTokenIds[0]);
  };

  console.log(nfts)

  useEffect(() => {
    if (actor) {
      nftCollection();
    }
  }, [actor]);


  return (
    <div>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <TreeItem nodeId="0" label={canisterId}>
          <TreeItem nodeId="1" label="NFTs">
            {nfts?.map((nft, index) => (
            
              <TreeItem key={index} nodeId={`${nft}+${index}`} label={nft} onClick={() => setCurrentNft(nft)}>
                
                </TreeItem>
             
            ))}
          </TreeItem>
          <TreeItem nodeId="2" label="Libraries">
            <TreeItem nodeId="3" label={children} />
          </TreeItem>
        </TreeItem>
      </TreeView>
    </div>
  );
};

export default TreeViewPart;
