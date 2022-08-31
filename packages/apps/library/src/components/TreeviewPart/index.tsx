import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import LibraryBox from '../LibraryBox';

const TreeViewPart = ({ children }: any) => {
  const { actor, canisterId , tokenId} = useContext(AuthContext);
  const [nfts, setNfts] = useState([]);
  const [currentNft, setCurrentNft] = useState();
  const [NftData, setNftData] = useState("tacos");


  const nftCollection = async () => {
    const response = await actor?.collection_nft_origyn([]);
    const collectionNFT = response.ok;

    console.log("🚀 ~ file: index.tsx ~ line 20 ~ nftCollection ~ collectionNFT", collectionNFT)

    const collectionPreview = response.ok.metadata[0].Class.filter((res) => {
      return res.name === 'primary_asset'})[0].value.Text

    setNftData(collectionPreview)
    console.log("🚀 ~ file: index.tsx ~ line 22 ~ collectionPreview ~ collectionPreview", collectionPreview)
    console.log("this is it", NftData)



    const obj_token_ids = collectionNFT.token_ids;

    const arrayPreview = [];
    const arrayTokenIds = [];
    for (var x in obj_token_ids) {
      var newID = obj_token_ids[x];
      arrayTokenIds.push(newID);
    }

    return setNfts(arrayTokenIds[0]);
  };


  useEffect(() => {
    if (actor) {
      actor.nft_origyn(tokenId)
      .then((r) => {
        console.log('🚀 ~ file: index.tsx ~ line 40 ~ useEffect ~ r', r);
      })
    }},[])

  console.log(nfts);

  useEffect(() => {
    if (actor) {
      nftCollection();
    }
  }, [actor]);

  // useEffect(() => {
  //   if (actor) {
  //     actor
  //       .actor?.collection_nft_origyn([])
  //       .then((response) => {
  //         setNftData(response.ok.metadata[0].Class.filter((res) => {
  //           return res.name === 'primary_asset'})[0].value.Text
  //         );
          
  //       })
  //       .catch(console.log);
  //   }
  // }, [actor]);
  
  // console.log("this is NftData 212121", NftData);

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
                <LibraryBox currentNft={currentNft}/>
                <Card
                  variant="outlined"
                  sx={{
                    minWidth: 275,
                    borderRadius: '0px',
                  }}
                >
                  <CardContent>

                  </CardContent>
                </Card>
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
