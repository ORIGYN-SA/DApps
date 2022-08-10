import React from 'react'
import Box from '@mui/material/Box'

//Source Test
//https://nft.origyn.network/-/nftforgood_uffc/-/ogy.nftforgood_uffc.1/-/ogy.nftforgood_uffc.1.primary

const LibraryVideo = (props) => {
  return (
    <Box
      sx={{
        width: 'auto',
        height: 'auto',
        textAlign: 'center',
      }}
    >
      <video controls height="300px">
        <source src={props.source} type="video/mp4" />
      </video>
    </Box>
  )
}

export default LibraryVideo
