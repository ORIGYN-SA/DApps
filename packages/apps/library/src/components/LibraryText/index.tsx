import React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import LinkIcon from '@mui/icons-material/Link'
import Tooltip from '@mui/material/Tooltip'

const linkStyle = {
  width: 'auto',
  height: 'auto',
  textAlign: 'left',
  m: 2,
  overflow: 'hidden',
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif;',
  color: '#000000!important',
}

const LibraryText = (props: any) => {
  return (
    <Box sx={linkStyle}>
      <Tooltip title={props.source}>
        <IconButton>
          <LinkIcon />
        </IconButton>
      </Tooltip>
      <Tooltip describeChild title={props.source}>
        <a href={props.source} target="_blank" rel="noreferrer">
          {props.source}
        </a>
      </Tooltip>
    </Box>
  )
}

export default LibraryText
