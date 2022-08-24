import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@dapp/features-authentication'
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

const TreeViewPart =  () => {

  const { tokenId, actor } = useContext(AuthContext)
  const [libData, setLibData] = useState([])

  useEffect(() => {
    if (actor) {
      actor
        .nft_origyn(tokenId)
        .then((r) => {
          console.log(r)
          setLibData(
            r.ok.metadata.Class.filter((res) => {
              return res.name === 'library'
            })[0].value.Array.thawed
          )
          console.log('R', r)
        })
        .catch(console.log)
    }
  }, [actor])

  return (
    <div>
      
    <TreeView
     
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {libData?.map((library) => (
      <TreeItem 
      key={library?.Class[0]?.value?.Text}
      nodeId={library?.Class[0]?.value?.Text} 
      label={library?.Class[1]?.value?.Text}>
      </TreeItem>
      ))}
    </TreeView>
      
    </div>
  );
}

export default TreeViewPart;