import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

const TreeViewPart = ({ children }: any) => {
  const { actor, canisterId } = useContext(AuthContext);
  const [libData, setLibData] = useState([]);
  const [currentNft, setCurrentNft] = useState();
  const [nftData, setNftData] = useState([]);
  const [tokenIdSet, setTokenIdSet] = useState();

  useEffect(() => {
    if (actor) {
      actor
        .collection_nft_origyn([])
        .then((r) => {
          setNftData(r);
          console.log('collection_nft_origyn', r);
        })
        .catch("collection_nft_origyn error");
    }
  }, []);

  useEffect(() => {
    if (actor) {
      actor
        .nft_origyn(tokenIdSet)
        .then((r) => {
          setCurrentNft(r);
          console.log("nft_origyn", r.thawed.id.value.Text);
        })
        .catch("nft_origyn error");
    }
  }, []);  

  

  function toJson(data) {
    if (data !== undefined) {
      return JSON.stringify(
        data,
        (_, v) => (typeof v === "bigint" ? `${v}#bigint` : v),
        "\t"
      ).replace(/"(-?\d+)#bigint"/g, (_, a) => a);
    }
  }

  console.log("nftdata", toJson(nftData));

  return (
    <div>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <TreeItem nodeId="0" label={canisterId}>
          <TreeItem nodeId="1" label="NFTs">
            <TreeItem nodeId="22" label="NFT 1"/>
            <TreeItem nodeId="23" label="NFT 2"/>
            <TreeItem nodeId="24" label="NFT 3"/>
            {/* {nftData?.map((nft) => (
              // AICI TREBUIE SA-I ADAUG UN PREVIEW LA NFT, APOI SA COBOR IAR CU LIBRARII IN TREEVIEW
              <TreeItem key={nft} nodeId={nft} label={nft.name} onClick={() => setTokenIdSet(nft.id)}>
                {/* aici cand dau click pe un TreeItem, pot face un Treeitem cu datele NFT */}
                {/* <TreeItem nodeId={nft} label={currentNft}/>
              </TreeItem> 
            ))} */}
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
