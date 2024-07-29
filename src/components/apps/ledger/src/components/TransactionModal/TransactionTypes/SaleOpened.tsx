import React from 'react';
// Icons ICP & OGY
import { ICPIcon, OGYIcon } from '@dapp/common-assets';
import { Grid, Container, HR } from '@origyn/origyn-art-ui';
import { toLargerUnit } from '@dapp/utils';

export const SaleOpened = (props: any) => {
  const trxType = props.data.type_txn;
  const trxPricingConfig = props.data.pricing_config;

  const trxSaleId = props.data.sale_id;

  let modalContent: any;

  const pricingType = trxPricingConfig.type_of_pricing_config;
  const { token } = trxPricingConfig;
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
  } = trxPricingConfig;

  switch (pricingType) {
    case 'dutch':
      modalContent = (
        <Container padding="16px">
          <Grid columns={1}>
            <Grid columns={1}>
              Pricing type:
              <br />
              <span style={{ color: 'grey' }}>{pricingType}</span>
              <br />
              Start price:
              <br />
              <span style={{ color: 'grey' }}>{start_price}</span>
              <br />
              Decay per hour:
              <br />
              <span style={{ color: 'grey' }}>{decay_per_hour}</span>
              <br />
              Reserve:
              <br />
              <span style={{ color: 'grey' }}>
                {toLargerUnit(reserve, Number(token.decimal)).toFixed()}
              </span>
            </Grid>
          </Grid>
        </Container>
      );
      break;
    case 'flat':
      modalContent = (
        <Container padding="16px">
          <Grid columns={1}>
            <Grid columns={1}>
              Pricing type:
              <br />
              <span style={{ color: 'grey' }}>{pricingType}</span>
              <br />
              Amount:
              <br />
              <span style={{ color: 'grey' }}>
                {' '}
                {toLargerUnit(amount, Number(token.decimal)).toFixed()}
              </span>
              <br />
              Canister:
              <br />
              <span style={{ color: 'grey' }}> {token.canisterString}</span>
              <br />
              Fee:
              <br />
              <span style={{ color: 'grey' }}>
                {' '}
                {toLargerUnit(token.Fee, Number(token.decimal)).toFixed()}
              </span>
              <br />
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
              <span style={{ color: 'grey' }}>{token.decimal.toString()}</span>
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
      modalContent = (
        <Container padding="16px">
          <Grid columns={2}>
            <Grid columns={1}>
              Start date:
              <br />
              <span style={{ color: 'grey' }}> {start_date}</span>
              <br />
              Ending date:
              <br />
              <span style={{ color: 'grey' }}> {ending_date}</span>
              <br />
              Pricing type:
              <br />
              <span style={{ color: 'grey' }}>{pricingType}</span>
              <br />
              Reserve:
              <br />
              <span style={{ color: 'grey' }}>
                {' '}
                {reserve ? toLargerUnit(reserve, Number(token.decimal)).toFixed() : '-'}
              </span>
              <br />
              Buy now:
              <br />
              <span style={{ color: 'grey' }}>
                {' '}
                {buy_now ? toLargerUnit(buy_now, Number(token.decimal)).toFixed() : '-'}
              </span>
              <br />
              Start price:
              <br />
              <span style={{ color: 'grey' }}>
                {' '}
                {toLargerUnit(start_price, Number(token.decimal)).toFixed()}
              </span>
              <br />
              Min increase:
              <br />
              <span style={{ color: 'grey' }}>
                {' '}
                {min_increase ? toLargerUnit(min_increase, Number(token.decimal)).toFixed() : '-'}
              </span>
            </Grid>
            <Grid columns={2}>
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
              <span style={{ color: 'grey' }}> {token.canisterString}</span>
              <br />
              Fee:
              <br />
              <span style={{ color: 'grey' }}>
                {' '}
                {toLargerUnit(token.Fee, Number(token.decimal)).toFixed()}
              </span>
              <br />
              Decimals:
              <br />
              <span style={{ color: 'grey' }}>{token.decimal.toString()}</span>
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
      modalContent = (
        <Container padding="16px">
          <Grid columns={1}>
            <Grid columns={1}>
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
        Transaction type:
        <br />
        <span style={{ color: 'grey' }}> {trxType}</span>
        <br />
        Sale ID:
        <br />
        <span style={{ color: 'grey' }}> {trxSaleId}</span>
      </Container>
      <HR marginTop={8} marginBottom={8} />
      {modalContent}
    </Container>
  );
};
