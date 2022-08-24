import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

export const OwnerTransfer = (props : any) => {
  const singleT_type = props.data.type_txn;
  const from_principal = props.data.from.acc_principal_string;
  const to_principal = props.data.to.acc_principal_string;

  return (
    <Box>
      <Box
        sx={{
          padding: 1,
          borderBottom: '1px solid',
        }}
      >
        <Typography
          sx={{ fontSize: 14 }}
          color="text.secondary"
          gutterBottom
        >
          Transaction type:
        </Typography>
        <Typography variant="h5" gutterBottom>
          {singleT_type}
        </Typography>
        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Transfer from:
            </Typography>
            <Typography gutterBottom>{from_principal}</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Transfer to:
            </Typography>
            <Typography gutterBottom>{to_principal}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
