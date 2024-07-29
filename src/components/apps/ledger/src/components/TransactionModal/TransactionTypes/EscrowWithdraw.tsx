import React from 'react';
// Icons ICP & OGY
import { ICPIcon, OGYIcon } from '@dapp/common-assets';
import { Grid, Container, HR } from '@origyn/origyn-art-ui';
import { toLargerUnit } from '@dapp/utils';

export const EscrowWithdraw = (props: any) => {
  const { type_txn, buyer, seller, token, token_id, amount, trx_id } = props.data;

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
        <span style={{ color: 'grey' }}>{type_txn}</span>
        <br />
        Transaction ID:
        <br />
        <span style={{ color: 'grey' }}>{id_trans}</span>
      </Container>
      <HR marginTop={8} marginBottom={8} />
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
            Token ID: <span style={{ color: 'grey' }}>{token_id}</span>
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
            <br />
            Standard: <span style={{ color: 'grey' }}>{token.standard}</span>
          </Grid>
        </Grid>
      </Container>
      <HR marginTop={8} marginBottom={8} />
    </Container>
  );
};
