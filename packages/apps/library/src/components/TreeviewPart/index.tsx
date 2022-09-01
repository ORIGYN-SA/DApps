import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import NFTBox from '../NFTBox';
import Grid from '@mui/material/Grid';
import NFTLibrary from '../NFTLibrary';

const TreeViewPart = ({ children }: any) => {
  const { actor, canisterId } = useContext(AuthContext);
  const [nfts, setNfts] = useState([]);
  const [currentNft, setCurrentNft] = useState();

  const nftCollection = async () => {
    const response = await actor?.collection_nft_origyn([]);
    const collectionNFT = response.ok;

    console.log('🚀 ~ file: index.tsx ~ line 20 ~ nftCollection ~ collectionNFT', collectionNFT);

    // const collectionPreview = response.ok.metadata[0].Class.filter((res) => {
    //  return res.name === 'primary_asset'})[0].value.Text

    const obj_token_ids = collectionNFT.token_ids;

    const arrayTokenIds = [];
    for (var x in obj_token_ids) {
      var newID = obj_token_ids[x];
      arrayTokenIds.push(newID);
    }

    return setNfts(arrayTokenIds[0]);
  };

  useEffect(() => {
    if (actor) {
      actor.nft_origyn('bm-1').then((r) => {
        console.log('🚀 ~ file: index.tsx ~ line 40 ~ useEffect ~ r', r);
      });
    }
  }, []);

  console.log(nfts);

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
              <TreeItem
                key={index}
                nodeId={`${nft}+${index}`}
                label={nft}
                onClick={() => setCurrentNft(nft)}
              >
                <Grid container spacing={3}>
                  <Grid item>
                    <NFTBox currentNft={currentNft} />
                  </Grid>
                  <Grid item>
                    <NFTLibrary currentNft={currentNft} />
                  </Grid>
                </Grid>
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
