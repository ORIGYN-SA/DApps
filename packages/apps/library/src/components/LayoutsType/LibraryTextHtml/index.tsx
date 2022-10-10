import React from 'react'
import Box from '@mui/material/Box'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Tooltip from '@mui/material/Tooltip'

const linkStyle = {
  width: 'auto',
  height: 'auto',
  textAlign: 'center',
  m: 2,
}

const LibraryTextHtml = (props: any) => {
  return (
    <Box sx={linkStyle}>
      <Tooltip title={props.source}>
        <InsertDriveFileIcon sx={{ fontSize: 50 }} />
      </Tooltip>
    </Box>
  )
}

export default LibraryTextHtml;
