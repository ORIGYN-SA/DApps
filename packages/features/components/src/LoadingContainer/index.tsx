import React from 'react'
import { Box, LinearProgress } from '@mui/material'

export const LoadingContainer = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  )
}
