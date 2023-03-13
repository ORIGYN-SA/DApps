import React from 'react';
// Icons ICP & OGY
import { ICPIcon, OGYIcon } from '@dapp/common-assets';
import { Grid, Container, HR } from '@origyn/origyn-art-ui';

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
              <span style={{ color: 'grey' }}>{pricingType}</span>
              <br />
              Start price:
              <br />
              <span style={{ color: 'grey' }}>{start_price}</span>
            </Grid>
            <Grid colum={2}>
              Decay per hour:
              <br />
              <span style={{ color: 'grey' }}>{decay_per_hour}</span>
              <br />
              Reserve:
              <br />
              <span style={{ color: 'grey' }}> {reserve}</span>
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
              <span style={{ color: 'grey' }}>{pricingType}</span>
              <br />
              Amount:
              <br />
              <span style={{ color: 'grey' }}>{amount}</span>
              <br />
              Canister:
              <br />
              <span style={{ color: 'grey' }}> {token.canister_string}</span>
              <br />
              Fee:
              <br />
              <span style={{ color: 'grey' }}>{token.fee}</span>
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
              <span style={{ color: 'grey' }}>{token.decimal}</span>
              <br />
              Standard:
              <br />
              <span style={{ color: 'grey' }}> {token.standard}</span>
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
              <span style={{ color: 'grey' }}> {start_date}</span>
            </Grid>
            <Grid colum={1}>
              Ending date:
              <br />
              <span style={{ color: 'grey' }}> {ending_date}</span>
            </Grid>
            <Grid colum={1}>
              Pricing type:
              <br />
              <span style={{ color: 'grey' }}>{pricingType}</span>
              <br />
              Reserve:
              <br />
              <span style={{ color: 'grey' }}> {reserve}</span>
              <br />
              Buy now:
              <br />
              <span style={{ color: 'grey' }}> {buy_now}</span>
              <br />
              Start price:
              <br />
              <span style={{ color: 'grey' }}> {start_price}</span>
              <br />
              Min increase:
              <br />
              <span style={{ color: 'grey' }}> {min_increase}</span>
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
              <span style={{ color: 'grey' }}> {token.canister_string}</span>
              <br />
              Fee:
              <br />
              <span style={{ color: 'grey' }}> {token.fee}</span>
              <br />
              Decimals:
              <br />
              <span style={{ color: 'grey' }}>{token.decimal}</span>
              <br />
              Standard:
              <br />
              <span style={{ color: 'grey' }}>{token.standard}</span>
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
              <span style={{ color: 'grey' }}> {pricingType}</span>
              <br />
              Transaction ID:
              <br />
              <span style={{ color: 'grey' }}> {txn_id}</span>
            </Grid>
          </Grid>
        </Container>
      );
      break;
  }

  return (
    <Container>
      <Container padding="16px">
        Transaction type: <span style={{ color: 'grey' }}>{singleT_type}</span>
        <br />
        Sale ID: <span style={{ color: 'grey' }}>{singleT_sale_id}</span>
      </Container>
      <HR marginTop="8px" marginBottom="8px" />
      {display_pricing_config}
      <HR marginTop="8px" marginBottom="8px" />
    </Container>
  );
};
