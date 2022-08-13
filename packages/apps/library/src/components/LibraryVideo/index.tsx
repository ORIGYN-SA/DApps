import React from 'react'
import Box from '@mui/material/Box'

const LibraryVideo = (props: any) => {
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
