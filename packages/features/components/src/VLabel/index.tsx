import React from 'react';

import { Typography } from '@mui/material';

export const VersionLabel = (props : any) => {
  const VNumber: string = props.ledgerVersion;
  return (
    <Typography
      variant="button"
      display="block"
      gutterBottom
      sx={{ textAlign: 'right' }}
    >
      LEDGER - {VNumber}
    </Typography>
  );
};
