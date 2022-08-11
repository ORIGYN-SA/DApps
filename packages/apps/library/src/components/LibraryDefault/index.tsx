import React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import PropTypes from 'prop-types';

const linkStyle = {
  width: 'auto',
  height: 'auto',
  textAlign: 'left',
  m: 2,
  overflow: 'hidden',
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif;',
  color: '#000000!important',
}

//Source Test
//https://nft.origyn.network/-/nftforgood_uffc/-/ogy.nftforgood_uffc.1/-/ogy.nftforgood_uffc.1.primary

const LibraryText = (props) => {
  return (
    <Box sx={linkStyle}>
      <Tooltip title={props.source}>
        <IconButton>
          <FileDownloadIcon />
        </IconButton>
      </Tooltip>
      <Tooltip describeChild title={props.source}>
        <a href={props.source} download>
          Click to Download
        </a>
      </Tooltip>
    </Box>
  )
}

LibraryText.propTypes = {
  source: PropTypes.string.isRequired,
}

export default LibraryText
