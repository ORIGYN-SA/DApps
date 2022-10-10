import React from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
const linkStyle = {
  width: 'auto',
  height: 'auto',
  textAlign: 'center',
  m: 2,
}

const LibraryPdf = (props: any) => {
  return (
    <Box sx={linkStyle}>
      <Tooltip title={props.source}>
        <PictureAsPdfIcon sx={{ fontSize: 50 }} />
      </Tooltip>
    </Box>
  )
}

export default LibraryPdf;
