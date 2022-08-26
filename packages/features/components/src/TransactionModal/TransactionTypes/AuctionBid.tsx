import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
// Icons ICP & OGY
import { ICPIcon } from '@dapp/common-assets';
import { OGYIcon } from '@dapp/common-assets';

export const AuctionBid = (props: any) => {
  const { type_txn, buyer, amount, token, sale_id } = props.data;

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
        <Typography variant="h5" gutterBottom data-testid="typeTrans">
          {type_txn}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Sale ID:
        </Typography>
        <Typography variant="h5" gutterBottom>
          {sale_id}
        </Typography>
        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Buyer:
            </Typography>
            <Typography gutterBottom>{buyer.acc_principal_string}</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Amount:
            </Typography>
            <Typography gutterBottom>{amount}</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ padding: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Canister:
            </Typography>
            <Typography gutterBottom>{token.canister_string}</Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Fee:
            </Typography>
            <Typography gutterBottom>{token.fee}</Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Decimals:
            </Typography>
            <Typography gutterBottom>{token.decimal}</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Symbol:
            </Typography>
            <Typography>
              {token.symbol === 'OGY' ? (
                <OGYIcon className="token-symbol" />
              ) : (
                <ICPIcon className="token-symbol" />
              )}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Standard:
            </Typography>
            <Typography gutterBottom>{token.standard}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
