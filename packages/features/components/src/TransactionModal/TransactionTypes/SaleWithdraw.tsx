import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

const SaleWithdraw = (props: any) => {
  // type
  const singleT_type = props.data.type_txn;
  // buyer
  const account_buyer = props.data.buyer;
  const buyer_principal = account_buyer.acc_principal_string;
  // seller
  const account_seller = props.data.seller;
  const seller_principal = account_seller.acc_principal_string;
  // token
  const sale_wit_token = props.data.token;
  // token specs
  const canister = sale_wit_token.canister_string;
  const {fee} = sale_wit_token;
  const sym = sale_wit_token.symbol;
  const decimals = sale_wit_token.decimal;
  const {standard} = sale_wit_token;
  // token id
  const {token_id} = props.data;
  const {amount} = props.data;
  let token_fee = props.data.fee;
  if (!token_fee) {
    token_fee = 'Undefined';
  }
  // trx_id
  const trans = props.data.trx_id;
  const {_nat} = trans;
  const {_text} = trans;
  let id_trans;
  if (_text) {
    id_trans = _text;
  } else {
    id_trans = _nat;
  }
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
        <Typography
          sx={{ fontSize: 14 }}
          color="text.secondary"
          gutterBottom
        >
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
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Buyer:
            </Typography>
            <Typography gutterBottom>{buyer_principal}</Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Seller:
            </Typography>
            <Typography gutterBottom>{seller_principal}</Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Token ID:
            </Typography>
            <Typography gutterBottom>{token_id}</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Amount:
            </Typography>
            <Typography gutterBottom>{amount}</Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Fee:
            </Typography>
            <Typography gutterBottom>{token_fee}</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ padding: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Canister:
            </Typography>
            <Typography gutterBottom>{canister}</Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Fee:
            </Typography>
            <Typography gutterBottom>{fee}</Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Decimals:
            </Typography>
            <Typography gutterBottom>{decimals}</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Symbol:
            </Typography>
            <Typography gutterBottom>{sym}</Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Standard:
            </Typography>
            <Typography gutterBottom>{standard}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SaleWithdraw;
