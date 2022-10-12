import React, { useEffect, useContext } from 'react'
import Box from '@mui/material/Box'
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import Tooltip from '@mui/material/Tooltip'
import { AuthContext } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';

const linkStyle = {
  width: 'auto',
  height: 'auto',
  textAlign: 'center',
  m: 2,
}

const LibraryFont = (props: any) => {
  const { canisterId } = useContext(AuthContext);
  const [link, setLink] = React.useState('');
  const formattedLink = async () => {
    const link = await GetFormattedLink(canisterId, props.source);
    setLink(link);
  }
  useEffect(() => {
    formattedLink();
  }, []);

  return (
    <Box sx={linkStyle}>
      <Tooltip title={link}>
        <FontDownloadIcon sx={{ fontSize: 50 }} />
      </Tooltip>
    </Box>
  )
}

export default LibraryFont;
