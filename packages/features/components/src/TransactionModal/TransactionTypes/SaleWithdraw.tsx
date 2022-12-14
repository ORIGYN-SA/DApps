import React from 'react';
import { Grid, Container, HR } from '@origyn-sa/origyn-art-ui';
import { ICPIcon, OGYIcon } from '@dapp/common-assets';

export const SaleWithdraw = (props: any) => {
  const { type_txn, buyer, seller, token, token_id, amount, trx_id } = props.data;

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
    <Container>
      <Container padding="16px">
        Transaction type:
        <br />
        {type_txn}
        <br />
        Transaction ID:
        <br />
        {id_trans}
      </Container>
      <Container padding="16px">
        <Grid columns={2}>
          <Grid column={1}>
            Buyer:
            <br />
            {buyer.acc_principal_string}
            <br />
            Seller:
            <br />
            {seller.acc_principal_string}
            <br />
            Token ID:
            <br />
            {token_id}
          </Grid>
          <Grid column={2}>
            Amount:
            <br />
            {amount}
            <br />
            Fee:
            <br />
            {token_fee}
          </Grid>
        </Grid>
      </Container>
      <Container padding="16px">
        <Grid columns={2}>
          <Grid column={1}>
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
          </Grid>
          <Grid column={2}>
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
            {token.standard}
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};
