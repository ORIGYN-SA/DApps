import React from 'react';
// Icons ICP & OGY
import { ICPIcon, OGYIcon } from '@dapp/common-assets';
import { Grid, Container, HR } from '@origyn-sa/origyn-art-ui';

export const SaleOpened = (props: any) => {
  const singleT_type = props.data.type_txn;
  const singleT_pricing = props.data.pricing_config;

  const singleT_sale_id = props.data.sale_id;

  // This variable contain all the pricing config
  // Its used in data to show
  let display_pricing_config: any;

  const type_of_pricing = singleT_pricing.type_of_pricing_config;
  const pricingType = type_of_pricing.toUpperCase();
  const { token } = singleT_pricing;
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
  } = singleT_pricing;

  // Depending on the pricing type I show different data
  // Switch here

  switch (type_of_pricing) {
    case 'dutch':
      display_pricing_config = (
        <Container padding="16px">
          <Grid columns={2}>
            <Grid colum={1}>
              Pricing type:
              <br />
              {pricingType}
              <br />
              Start price:
              <br />
              {start_price}
            </Grid>
            <Grid colum={2}>
              Decay per hour:
              <br />
              {decay_per_hour}
              <br />
              Reserve:
              <br />
              {reserve}
            </Grid>
          </Grid>
        </Container>
      );
      break;
    case 'flat':
      display_pricing_config = (
        <Container padding="16px">
          <Grid columns={2}>
            <Grid colum={1}>
              Pricing type:
              <br />
              {pricingType}
              <br />
              Amount:
              <br />
              {amount}
              <br />
              Canister:
              <br />
              {token.canister_string}
              <br />
              Fee:
              <br />
              {token.fee}
            </Grid>

            <Grid colum={2}>
              Symbol:
              <br />
              {token.symbol === 'OGY' ? (
                <OGYIcon className="token-symbol" />
              ) : (
                <ICPIcon className="token-symbol" />
              )}
              <br />
              Decimals:
              <br />
              {token.decimal}
              <br />
              Standard:
              <br />
              {token.standard}
            </Grid>
          </Grid>
        </Container>
      );

      break;
    case 'auction':
      display_pricing_config = (
        <Container padding="16px">
          <Grid columns={2}>
            <Grid colum={1}>
              Start date:
              <br />
              {start_date}
            </Grid>
            <Grid colum={1}>
              Ending date:
              <br />
              {ending_date}
            </Grid>
            <Grid colum={1}>
              Pricing type:
              <br />
              {pricingType}
              <br />
              Reserve:
              <br />
              {reserve}
              <br />
              Buy now:
              <br />
              {buy_now}
              <br />
              Start price:
              <br />
              {start_price}
              <br />
              Min increase:
              <br />
              {min_increase}
            </Grid>
            <Grid colum={2}>
              Symbol:
              <br />
              {token.symbol === 'OGY' ? (
                <OGYIcon className="token-symbol" />
              ) : (
                <ICPIcon className="token-symbol" />
              )}
              <br />
              Canister:
              <br />
              {token.canister_string}
              <br />
              Fee:
              <br />
              {token.fee}
              <br />
              Decimals:
              <br />
              {token.decimal}
              <br />
              Standard:
              <br />
              {token.standard}
            </Grid>
          </Grid>
        </Container>
      );

      break;
    case 'instant':
      display_pricing_config = (
        <Container padding="16px">
          <Grid columns={1}>
            <Grid colum={1}>
              Pricing type:
              <br />
              {pricingType}
              <br />
              Transaction ID:
              <br />
              {txn_id}
            </Grid>
          </Grid>
        </Container>
      );
      break;
  }

  return (
    <Container>
      <Container padding="16px">
        Transaction type: {singleT_type}
        <br />
        Sale ID: {singleT_sale_id}
      </Container>
      <HR marginTop="8px" marginBottom="8px" />
      {display_pricing_config}
      <HR marginTop="8px" marginBottom="8px" />
    </Container>
  );
};
