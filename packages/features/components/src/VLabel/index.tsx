import React from 'react';

import { Typography } from '@mui/material';
import { Container } from '@origyn-sa/origyn-art-ui';
export const VersionLabel = (props : any) => {
  const VNumber: string = props.ledgerVersion;

  return (
    <Container padding = "16px">
    <Typography
      variant="button"
      display="block"
      gutterBottom
      sx={{ textAlign: 'right' }}
    >
      LEDGER - {VNumber}
    </Typography>
    </Container>
  );
};
