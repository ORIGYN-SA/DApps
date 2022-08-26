import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

export const OwnerTransfer = (props: any) => {
  const { type_txn, from, to } = props.data;

  return (
    <Box>
      <Box
        sx={{
          padding: 1,
          borderBottom: '1px solid',
        }}
      >
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Transaction type:
        </Typography>
        <Typography variant="h5" gutterBottom>
          {type_txn}
        </Typography>
        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Transfer from:
            </Typography>
            <Typography gutterBottom>{from.acc_principal_string}</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Transfer to:
            </Typography>
            <Typography gutterBottom>{to.acc_principal_string}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
