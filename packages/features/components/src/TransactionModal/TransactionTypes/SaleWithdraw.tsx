import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

export const SaleWithdraw = (props: any) => {
  const { type_txn, buyer, seller, token, token_id, amount, trx_id } = props.data;

  const { canister_string, fee, symbol, decimal, standard } = token;

  let token_fee = props.data.fee;
  if (!token_fee) {
    token_fee = 'Undefined';
  }
  // trx_id

  const { _nat, _text } = trx_id;

  let id_trans;

  if (_text) {
    id_trans = _text;
  } else {
    id_trans = _nat.toString();
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
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Transaction ID:
        </Typography>
        <Typography variant="h5" gutterBottom>
          {id_trans}
        </Typography>
      </Box>
      <Box
        sx={{
          padding: 1,
          borderBottom: '1px solid',
        }}
      >
        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Buyer:
            </Typography>
            <Typography gutterBottom>{buyer.acc_principal_string}</Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Seller:
            </Typography>
            <Typography gutterBottom>{seller.acc_principal_string}</Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Token ID:
            </Typography>
            <Typography gutterBottom>{token_id}</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Amount:
            </Typography>
            <Typography gutterBottom>{amount}</Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Fee:
            </Typography>
            <Typography gutterBottom>{token_fee}</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ padding: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Canister:
            </Typography>
            <Typography gutterBottom>{canister_string}</Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Fee:
            </Typography>
            <Typography gutterBottom>{fee}</Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Decimals:
            </Typography>
            <Typography gutterBottom>{decimal}</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Symbol:
            </Typography>
            <Typography gutterBottom>{symbol}</Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Standard:
            </Typography>
            <Typography gutterBottom>{standard}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
