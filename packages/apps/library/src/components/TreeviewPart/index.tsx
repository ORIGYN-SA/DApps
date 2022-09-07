import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import NFTBox from '../NFTBox';
import Grid from '@mui/material/Grid';
import NFTLibrary from '../NFTLibrary';
import { getNftCollection } from '@origyn-sa/mintjs';
import { makeStyles } from "@material-ui/core/styles";
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import { ListItemButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  horizontal: {
    display: "flex",
    flexDirection: "row",
    padding: 0
  },
  vertical: {
    flexDirection: "column"
  }
}));

const TreeViewPart = ({ children }: any) => {
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const handleClick1 = (nft) => {
    setOpen1(!open1);
    setCurrentNft(nft);
  };
  const classes = useStyles();
  const { actor, canisterId } = useContext(AuthContext);
  const [nfts, setNfts] = useState([]);
  const [currentNft, setCurrentNft] = useState();

  const nftCollection = async () => {
    const response = await getNftCollection([]);
    const collectionNFT = response.ok;
    const obj_token_ids = collectionNFT.token_ids;

    const arrayTokenIds = [];
    for (var x in obj_token_ids) {
      var newID = obj_token_ids[x];
      arrayTokenIds.push(newID);
    }

    return setNfts(arrayTokenIds[0]);
  };

  console.log(nfts);

  useEffect(() => {
    if (actor) {
      nftCollection();
    }
  }, [actor]);

  return (
    <Grid container >
      <List className={classes.horizontal}>
        
        <Grid item >
          
          <ListItem
            sx={{
              border: '1px solid black',
            }}>
            <ListItemText primary={canisterId} />
          </ListItem>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
        <Grid item >
          <ListItem
            sx={{
              border: '1px solid black',
            }}>
            <ListItemButton onClick={handleClick}>
              <ListItemText primary="NFTs" />
              {open ? <ChevronLeft /> : <ChevronRight />}
            </ListItemButton>
          </ListItem>
          </Grid>
          </Grid>
          <Grid item xs={12}>
          <Grid item >
          <ListItem
            sx={{
              border: '1px solid black',
            }}>
            <ListItemButton onClick={handleClick}>
              <ListItemText primary="Libraries" />
              {open ? <ChevronLeft /> : <ChevronRight />}
            </ListItemButton>
          </ListItem>

        </Grid>
        </Grid>
        </Grid>
      
         
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Grid item >
            <ListItem
              className={classes.vertical}
              sx={{
                border: '1px solid black',
              }}>
              {nfts?.map((nft, index) => (
                <ListItemButton key={index} onClick={()=>handleClick1(nft)}>
                  <ListItemText primary={nft} />
                  {open1 ? <ChevronLeft /> : <ChevronRight />}
                </ListItemButton>
              ))}
            </ListItem>
          </Grid>
        </Collapse>
        <Collapse  in={open1} timeout="auto" unmountOnExit>
            <Grid item>
            <ListItem
              className={classes.horizontal}
              sx={{
                border: '1px solid black',
              }}>
            <NFTBox currentNft={currentNft} />
            <NFTLibrary currentNft={currentNft} />
            </ListItem>
            </Grid>
          </Collapse>
               <Grid item >

        </Grid>
      </List>
    </Grid>
    
    // add here colapse for Library and redesign
    
    // <div>
    //   <TreeView
    //     aria-label="file system navigator"
    //     defaultCollapseIcon={<ExpandMoreIcon />}
    //     defaultExpandIcon={<ChevronRightIcon />}
    //   >
    //     <TreeItem nodeId="0" label={canisterId}>
    //       <TreeItem nodeId="1" label="NFTs">
    //         {nfts?.map((nft, index) => (
    //           <TreeItem
    //             key={index}
    //             nodeId={`${nft}+${index}`}
    //             label={nft}
    //             onClick={() => setCurrentNft(nft)}
    //           >
    //             <Grid container spacing={3}>
    //               <Grid item>
    //                 <NFTBox currentNft={currentNft} />
    //               </Grid>
    //               <Grid item>
    //                 <NFTLibrary currentNft={currentNft} />
    //               </Grid>
    //             </Grid>
    //           </TreeItem>
    //         ))}
    //       </TreeItem>
    //       <TreeItem nodeId="2" label="Libraries">
    //         <TreeItem nodeId="3" label={children} />
    //       </TreeItem>
    //     </TreeItem>
    //   </TreeView>
    // </div>
  );
};

export default TreeViewPart;