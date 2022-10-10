import React from 'react'
import Box from '@mui/material/Box'
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import Tooltip from '@mui/material/Tooltip'

const linkStyle = {
  width: 'auto',
  height: 'auto',
  textAlign: 'center',
  m: 2,
}

const LibraryFont = (props: any) => {
  return (
    <Box sx={linkStyle}>
      <Tooltip title={props.source}>
        <FontDownloadIcon sx={{ fontSize: 50 }} />
      </Tooltip>
    </Box>
  )
}

export default LibraryFont;
