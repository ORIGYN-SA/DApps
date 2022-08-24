import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
// Icons ICP & OGY
import {ICPIcon, OGYIcon} from '@dapp/common-assets';

export const SaleOpened = (props : any) => {
  const singleT_type = props.data.type_txn;
  const singleT_pricing = props.data.pricing_config;

  const singleT_sale_id = props.data.sale_id;

  // This variable contain all the pricing config
  // Its used in data to show
  let display_pricing_config: any;

  const type_of_pricing = singleT_pricing.type_of_pricing_config;
  // Depending on the pricing type I show different data
  // Switch here
  switch (type_of_pricing) {
    case 'dutch':
      var pricingType = type_of_pricing.toUpperCase();

      var start_price = singleT_pricing.start_price;
      var decay_per_hour = singleT_pricing.decay_per_hour;
      var reserve = singleT_pricing.reserve;

      display_pricing_config = (
        <Box
          sx={{
            padding: 1,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Pricing type:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {pricingType}
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Start price:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {start_price}
              </Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Decay per hour:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {decay_per_hour}
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
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
      var pricingType = type_of_pricing.toUpperCase();

      var amount = singleT_pricing.amount;

      var obj_token = singleT_pricing.token;
      var canister = obj_token.canister_string;
      var fee = obj_token.fee;
      var sym = obj_token.symbol;
      var decimals = obj_token.decimal;
      var standard = obj_token.standard;

      display_pricing_config = (
        <Box
          sx={{
            padding: 1,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Pricing type:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {pricingType}
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Amount:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {amount}
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Canister:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {canister}
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Fee:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {fee}
              </Typography>
            </Grid>

            <Grid item xs={6} md={6}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Symbol:
              </Typography>
              <Typography>
                {sym === 'OGY' ? (
                  <OGYIcon className="token-symbol" />
                ) : (
                  <ICPIcon className="token-symbol" />
                )}
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Decimals:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {decimals}
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
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
      var pricingType = type_of_pricing.toUpperCase();
      var {reserve} = singleT_pricing;
      var buyNow = singleT_pricing.buy_now;
      var startPrice = singleT_pricing.start_price;
      var minIncrease = singleT_pricing.min_increase;
      var start = singleT_pricing.start_date;
      var ending = singleT_pricing.ending_date;

      var obj_token = singleT_pricing.token;
      var canister = obj_token.canister_string;
      var {fee} = obj_token;
      var sym = obj_token.symbol;
      var decimals = obj_token.decimal;
      var {standard} = obj_token;

      display_pricing_config = (
        <Box
          sx={{
            padding: 1,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Start date:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {start}
              </Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Ending date:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {ending}
              </Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Pricing type:
              </Typography>
              <Typography gutterBottom>{pricingType}</Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Reserve:
              </Typography>
              <Typography gutterBottom>{reserve}</Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Buy now:
              </Typography>
              <Typography gutterBottom>{buyNow}</Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Start price:
              </Typography>
              <Typography gutterBottom>{startPrice}</Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Min increase:
              </Typography>
              <Typography gutterBottom>{minIncrease}</Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Symbol:
              </Typography>
              <Typography>
                {sym === 'OGY' ? (
                  <OGYIcon className="token-symbol" />
                ) : (
                  <ICPIcon className="token-symbol" />
                )}
              </Typography>
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
      );

      break;
    case 'instant':

      var pricingType = type_of_pricing.toUpperCase();
      var txn_id = singleT_pricing.txn_id;

      display_pricing_config = (
        <Box
          sx={{
            padding: 1,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Pricing type:
              </Typography>
              <Typography sx={{ fontSize: 12 }} gutterBottom>
                {pricingType}
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
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
          Sale ID:
        </Typography>
        <Typography gutterBottom>{singleT_sale_id}</Typography>
      </Box>
      {display_pricing_config}
    </Box>
  );
};
