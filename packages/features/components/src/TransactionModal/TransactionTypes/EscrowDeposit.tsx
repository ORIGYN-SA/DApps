import React from 'react';
import { ICPIcon, OGYIcon } from '@dapp/common-assets';
import { Grid, Container, HR } from '@origyn-sa/origyn-art-ui';

export const EscrowDeposit = (props: any) => {
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
    <>
      <Container>
        <Container padding="16px">
          Transaction type: {type_txn}
          <br />
          Transaction ID: {id_trans}
        </Container>
        <HR marginTop="8px" marginBottom="8px" />
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
              Token ID: {token_id}
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
        <HR marginTop="8px" marginBottom="8px" />
        <Container padding="16px">
          <Grid columns={2}>
            <Grid column={1}>
              Canister: {token.canister_string}
              <br />
              Fee: {token.fee}
              <br />
              Decimals: {token.decimal}
            </Grid>
            <Grid column={2}>
              Symbol:{' '}
              {token.symbol === 'OGY' ? (
                <OGYIcon className="token-symbol" />
              ) : (
                <ICPIcon className="token-symbol" />
              )}
              <br />
              Standard: {token.standard}
            </Grid>
          </Grid>
        </Container>
        <HR marginTop="8px" marginBottom="8px" />
      </Container>
    </>
  );
};
