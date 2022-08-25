import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
// Icons ICP & OGY
import { ICPIcon, OGYIcon } from '@dapp/common-assets';

export const SaleOpened = (props: any) => {
  const singleT_type = props.data.type_txn;
  const singleT_pricing = props.data.pricing_config;

  const singleT_sale_id = props.data.sale_id;

  // This variable contain all the pricing config
  // Its used in data to show
  let display_pricing_config: any;

  const type_of_pricing = singleT_pricing.type_of_pricing_config;
  const pricingType = type_of_pricing.toUpperCase();

  const {
    start_price,
    decay_per_hour,
    reserve,
    amount,
    txn_id,
    buy_now,
    min_increase,
    start_date,
    ending_date,
    token,
  } = singleT_pricing;

  const { canister_string, fee, symbol, decimal, standard } = token;
  // Depending on the pricing type I show different data
  // Switch here

  switch (type_of_pricing) {
    case 'dutch':
      display_pricing_config = (
        <Box
          sx={{
            padding: 1,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Pricing type:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {pricingType}
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Start price:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {start_price}
              </Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Decay per hour:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {decay_per_hour}
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Reserve:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {reserve}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      );
      break;
    case 'flat':
      display_pricing_config = (
        <Box
          sx={{
            padding: 1,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Pricing type:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {pricingType}
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Amount:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {amount}
              </Typography>
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
                Decimals:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {decimal}
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

      break;
    case 'auction':
      display_pricing_config = (
        <Box
          sx={{
            padding: 1,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Start date:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {start_date}
              </Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Ending date:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {ending_date}
              </Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Pricing type:
              </Typography>
              <Typography gutterBottom>{pricingType}</Typography>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Reserve:
              </Typography>
              <Typography gutterBottom>{reserve}</Typography>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Buy now:
              </Typography>
              <Typography gutterBottom>{buy_now}</Typography>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Start price:
              </Typography>
              <Typography gutterBottom>{start_price}</Typography>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Min increase:
              </Typography>
              <Typography gutterBottom>{min_increase}</Typography>
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
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Standard:
              </Typography>
              <Typography gutterBottom>{standard}</Typography>
            </Grid>
          </Grid>
        </Box>
      );

      break;
    case 'instant':
      display_pricing_config = (
        <Box
          sx={{
            padding: 1,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Pricing type:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {pricingType}
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Transaction ID:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {txn_id}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      );
      break;
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
          {singleT_type}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Sale ID:
        </Typography>
        <Typography gutterBottom>{singleT_sale_id}</Typography>
      </Box>
      {display_pricing_config}
    </Box>
  );
};
