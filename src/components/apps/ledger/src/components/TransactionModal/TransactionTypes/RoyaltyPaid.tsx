import React from 'react';
import { Grid, Container, HR } from '@origyn/origyn-art-ui';
import { ICPIcon, OGYIcon } from '@dapp/common-assets';
import { toLargerUnit } from '@dapp/utils';

export const RoyaltyPaid = (props: any) => {
  const { type_txn, buyer, seller, receiver, token, token_id, amount } = props.data;

  return (
    <Container>
      <Container padding="16px">
        Transaction type:
        <br />
        <span style={{ color: 'grey' }}>{type_txn}</span>
        <br />
      </Container>
      <Container padding="16px">
        <Grid columns={1}>
          <Grid columns={1}>
            Buyer:
            <br />
            <span style={{ color: 'grey' }}>{buyer.acc_principal_string}</span>
            <br />
            Seller:
            <br />
            <span style={{ color: 'grey' }}>{seller.acc_principal_string}</span>
            <br />
            Receiver:
            <br />
            <span style={{ color: 'grey' }}>{receiver.acc_principal_string}</span>
            <br />
            Token ID:
            <br />
            <span style={{ color: 'grey' }}>{token_id}</span>
            <br />
            Amount:
            <br />
            <span style={{ color: 'grey' }}>
              {toLargerUnit(amount, Number(token.decimal)).toFixed()}
            </span>
            <br />
          </Grid>
        </Grid>
      </Container>
      <HR marginTop={16} marginBottom={16} />
      <Container padding="16px">
        <Grid columns={2}>
          <Grid columns={1}>
            Canister:
            <br />
            <span style={{ color: 'grey' }}>{token.canister_string}</span>
            <br />
            Fee:
            <br />
            <span style={{ color: 'grey' }}>
              {toLargerUnit(token.fee, Number(token.decimal)).toFixed()}
            </span>
            <br />
            Decimals:
            <br />
            <span style={{ color: 'grey' }}>{token.decimal.toString()}</span>
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
            Standard:
            <br />
            <span style={{ color: 'grey' }}>{token.standard}</span>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};
