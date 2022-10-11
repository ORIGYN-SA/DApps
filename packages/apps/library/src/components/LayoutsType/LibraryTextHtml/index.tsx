import React, { useEffect, useContext } from 'react'
import Box from '@mui/material/Box'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Tooltip from '@mui/material/Tooltip'
import { AuthContext } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';

const linkStyle = {
  width: 'auto',
  height: 'auto',
  textAlign: 'center',
  m: 2,
}

const LibraryTextHtml = (props: any) => {
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
        <InsertDriveFileIcon sx={{ fontSize: 50 }} />
      </Tooltip>
    </Box>
  )
}

export default LibraryTextHtml;
