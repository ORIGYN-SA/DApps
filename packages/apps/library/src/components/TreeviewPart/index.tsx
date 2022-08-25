import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

const TreeViewPart = ({ children }: any) => {
  const { actor, principal, canisterId } = useContext(AuthContext);
  // const [libData, setLibData] = useState([]);
  const [nftData, setNftData] = useState([]);

  // useEffect(() => {
  //   if (actor) {
  //     actor
  //       .nft_origyn(tokenId)
  //       .then((r) => {
  //         setLibData(
  //           r.ok.metadata.Class.filter((res) => {
  //             return res.name === 'library';
  //           })[0].value.Array.thawed,
  //         );
  //         console.log('nft_origyn', r);
  //       })
  //       .catch(console.log);
  //   }
  // }, [actor]);

  useEffect(() => {
    if (actor) {
      actor
        .collection_nft_origyn({principal})
        .then((r) => {
          setNftData(r.ok.nfts)
          console.log('balance_of_nft_origyn', r);
        })
        .catch(console.log);
    }
  }, [actor, principal]);

  return (
    <div>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        
      >
        <TreeItem nodeId="1" label="NFTs">
          {nftData?.map((nft) => (
            <TreeItem
              key={nft}
              nodeId={nft}
              label={nft}
            >
            </TreeItem>
          ))}
        </TreeItem>
        <TreeItem nodeId="2" label="Library">
        <TreeItem nodeId="3" label={children} />
        </TreeItem>
      </TreeView>
    </div>
  );
};

export default TreeViewPart;
