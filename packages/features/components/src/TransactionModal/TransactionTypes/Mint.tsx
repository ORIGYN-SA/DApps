import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
// Icons ICP & OGY
import { ICPIcon, OGYIcon } from '@dapp/common-assets';

export const Mint = (props: any) => {
  const { type_txn, mint_from, mint_to, sale } = props.data;

  const { amount, token } = sale;

  let display_token_config: any;

  if (token == 'Token not defined') {
    display_token_config = (
      <Box
        sx={{
          padding: 1,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Token:
            </Typography>
            <Typography sx={{ fontSize: 12 }} gutterBottom>
              {token}
            </Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Amount:
            </Typography>
            <Typography sx={{ fontSize: 12 }} gutterBottom>
              {amount}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  } else {
    const { canister_string, fee, symbol, decimal, standard } = token;
    display_token_config = (
      <Box
        sx={{
          padding: 1,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Canister:
            </Typography>
            <Typography sx={{ fontSize: 12 }} gutterBottom>
              {canister_string}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Fee:
            </Typography>
            <Typography sx={{ fontSize: 12 }} gutterBottom>
              {fee}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Decimals:
            </Typography>
            <Typography sx={{ fontSize: 12 }} gutterBottom>
              {decimal}
            </Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Symbol:
            </Typography>
            <Typography>
              {symbol === 'OGY' ? (
                <OGYIcon className="token-symbol" />
              ) : (
                <ICPIcon className="token-symbol" />
              )}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Standard:
            </Typography>
            <Typography sx={{ fontSize: 12 }} gutterBottom>
              {standard}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  }

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
              Mint from:
            </Typography>
            <Typography gutterBottom>{mint_from}</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Mint to:
            </Typography>
            <Typography gutterBottom>{mint_to}</Typography>
          </Grid>
        </Grid>
      </Box>
      {display_token_config}
    </Box>
  );
};
