import React from 'react';
import { Box, LinearProgress } from '@mui/material';

export const LoadingContainer = () => (
  <Box sx={{ width: '100%' }}>
    <LinearProgress color='secondary' />
  </Box>
);
