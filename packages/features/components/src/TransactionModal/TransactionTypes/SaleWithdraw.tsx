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
        <span style={{color: 'grey'}}>{type_txn}</span>
        <br />
        Transaction ID:
        <br />
        <span style={{color: 'grey'}}>{id_trans}</span>
      </Container>
      <Container padding="16px">
        <Grid columns={2}>
          <Grid column={1}>
            Buyer:
            <br />
            <span style={{color: 'grey'}}>{buyer.acc_principal_string}</span>
            <br />
            Seller:
            <br />
            <span style={{color: 'grey'}}>{seller.acc_principal_string}</span>
            <br />
            Token ID:
            <br />
            <span style={{color: 'grey'}}>{token_id}</span>
          </Grid>
          <Grid column={2}>
            Amount:
            <br />
            <span style={{color: 'grey'}}>{amount}</span>
            <br />
            Fee:
            <br />
            <span style={{color: 'grey'}}> {token_fee}</span>
          </Grid>
        </Grid>
      </Container>
      <Container padding="16px">
        <Grid columns={2}>
          <Grid column={1}>
            Canister:
            <br />
            <span style={{color: 'grey'}}>{token.canister_string}</span>
            <br />
            Fee:
            <br />
            <span style={{color: 'grey'}}>{token.fee}</span>
            <br />
            Decimals:
            <br />
            <span style={{color: 'grey'}}>{token.decimal}</span>
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
            <span style={{color: 'grey'}}>{token.standard}</span>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};
