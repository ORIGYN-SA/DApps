import React, { useEffect, useContext } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { AuthContext } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';
const linkStyle = {
  width: 'auto',
  height: 'auto',
  textAlign: 'center',
  m: 2,
}

const LibraryPdf = (props: any) => {
  const { canisterId } = useContext(AuthContext);
  const [link, setLink] = React.useState('');
  const formattedLink = async () => {
    const link = await GetFormattedLink(canisterId, props.source);
    setLink(link);
  }
  useEffect(() => {
    if(canisterId){
      formattedLink();
    }
  }, []);
  return (
    <Box sx={linkStyle}>
      <Tooltip title={link}>
        <PictureAsPdfIcon sx={{ fontSize: 50 }} />
      </Tooltip>
    </Box>
  )
}

export default LibraryPdf;
