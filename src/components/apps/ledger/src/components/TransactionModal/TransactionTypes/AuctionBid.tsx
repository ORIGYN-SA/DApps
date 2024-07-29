import React from 'react';
// Icons ICP & OGY
import { ICPIcon } from '@dapp/common-assets';
import { OGYIcon } from '@dapp/common-assets';
import { Grid, Container } from '@origyn/origyn-art-ui';
import { toLargerUnit } from '@dapp/utils';

export const AuctionBid = (props: any) => {
  const { type_txn, buyer, amount, token, sale_id } = props.data;

  return (
    <>
      <Container padding="16px">
        Transaction type:
        <br />
        <span style={{ color: 'grey' }}> {type_txn}</span>
        <br />
        Sale ID:
        <br />
        <span style={{ color: 'grey' }}> {sale_id}</span>
        <br />
        <Grid columns={1}>
          <Grid columns={1}>
            Buyer: <span style={{ color: 'grey' }}>{buyer.accountId}</span>
            <br />
            Amount:{' '}
            <span style={{ color: 'grey' }}>
              {toLargerUnit(amount, Number(token.decimal)).toFixed()}
            </span>
          </Grid>
        </Grid>
      </Container>
      <Container padding="16px">
        <Grid columns={2}>
          <Grid columns={1}>
            Canister: <span style={{ color: 'grey' }}>{token.canisterString}</span>
            <br />
            Fee:{' '}
            <span style={{ color: 'grey' }}>
              {toLargerUnit(token.fee, Number(token.decimal)).toFixed()}
            </span>
            <br />
            Decimals: <span style={{ color: 'grey' }}>{token.decimal.toString()}</span>
          </Grid>
          <Grid columns={2}>
            Symbol:{' '}
            {token.symbol === 'OGY' ? (
              <OGYIcon className="token-symbol" />
            ) : (
              <ICPIcon className="token-symbol" />
            )}
            Standard: <span style={{ color: 'grey' }}>{token.standard}</span>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
