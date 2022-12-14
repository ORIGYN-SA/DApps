import React from 'react';
// Icons ICP & OGY
import { ICPIcon, OGYIcon } from '@dapp/common-assets';
import { Grid, Container, HR } from '@origyn-sa/origyn-art-ui';

export const Mint = (props: any) => {
  const { type_txn, mint_from, mint_to, sale } = props.data;

  const { amount, token } = sale;

  let display_token_config: any;

  if (token == 'Token not defined') {
    display_token_config = (
      <Container padding="16px">
        <Grid columns={2}>
          <Grid column={1}>
            Token: <b>{token}</b>
          </Grid>
          <Grid column={2}>
            Amount: <b>{amount}</b>
          </Grid>
        </Grid>
      </Container>
    );
  } else {
    display_token_config = (
      <Container padding="16px">
        <Grid columns={2}>
          <Grid column={1}>
            Canister: {token.canister_string}
            Fee: {token.fee}
            Decimals:{token.decimal}
          </Grid>
          <Grid column={2}>
            Symbol: {token.symbol === 'OGY' ? (
              <OGYIcon className="token-symbol" />
            ) : (
              <ICPIcon className="token-symbol" />
            )}
            Standard:{token.standard}
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <Container padding="16px">
        Transaction type: <b>{type_txn}</b>
      </Container>
        <HR marginTop="8px" marginBottom="8px" />
      <Container padding="16px">
        <Grid columns={2}>
          <Grid column={1}>
            Mint from:
            <br />
            {mint_from}
          </Grid>
          <Grid column={2}>
            Mint to:
            <br />
            {mint_to}
          </Grid>
        </Grid>
      </Container>
      <HR marginTop="8px" marginBottom="8px" />
      {display_token_config}
    </Container>
  );
};
