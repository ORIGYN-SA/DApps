import React from 'react';
// Icons ICP & OGY
import { ICPIcon, OGYIcon } from '@dapp/common-assets';
import { Grid, Container, HR } from '@origyn-sa/origyn-art-ui';

export const EscrowWithdraw = (props: any) => {
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
        Transaction type: <span style={{color: 'grey'}}>{type_txn}</span>
        <br />
        Transaction ID:  <span style={{color: 'grey'}}>{id_trans}</span>
      </Container>
      <HR marginTop="8px" marginBottom="8px" />
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
            Token ID:  <span style={{color: 'grey'}}>{token_id}</span>
          </Grid>
          <Grid column={2}>
            Amount:
            <br />
            <span style={{color: 'grey'}}>{amount}</span>
            <br />
            Fee:
            <br />
            <span style={{color: 'grey'}}>{token_fee}</span>
          </Grid>
        </Grid>
      </Container>
      <Container padding="16px">
        <Grid columns={2}>
          <Grid column={1}>
            Canister:  <span style={{color: 'grey'}}>{token.canister_string}</span>
            <br />
            Fee:  <span style={{color: 'grey'}}>{token.fee}</span>
            <br />
            Decimals:  <span style={{color: 'grey'}}>{token.decimal}</span>
          </Grid>
          <Grid column={2}>
            Symbol:{' '}
            {token.symbol === 'OGY' ? (
              <OGYIcon className="token-symbol" />
            ) : (
              <ICPIcon className="token-symbol" />
            )}
            <br />
            Standard:  <span style={{color: 'grey'}}>{token.standard}</span>
          </Grid>
        </Grid>
      </Container>
      <HR marginTop="8px" marginBottom="8px" />
    </Container>
  );
};
