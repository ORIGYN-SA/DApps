import React from 'react';
// Icons ICP & OGY
import { ICPIcon, OGYIcon } from '@dapp/common-assets';
import { Grid, Container, HR } from '@origyn/origyn-art-ui';

export const Mint = (props: any) => {
  const { type_txn, mint_from, mint_to, sale } = props.data;

  const { amount, token } = sale;

  let display_token_config: any;

  if (token == 'Token not defined') {
    display_token_config = (
      <Container padding="16px">
        <Grid columns={2}>
          <Grid column={1}>
            Token: <span style={{ color: 'grey' }}>{token}</span>
          </Grid>
          <Grid column={2}>
            Amount: <span style={{ color: 'grey' }}>{amount}</span>
          </Grid>
        </Grid>
      </Container>
    );
  } else {
    display_token_config = (
      <Container padding="16px">
        <Grid columns={2}>
          <Grid column={1}>
            Canister: <span style={{ color: 'grey' }}>{token.canister_string}</span>
            Fee: <span style={{ color: 'grey' }}>{token.fee}</span>
            Decimals:<span style={{ color: 'grey' }}>{token.decimal}</span>
          </Grid>
          <Grid column={2}>
            Symbol:{' '}
            {token.symbol === 'OGY' ? (
              <OGYIcon className="token-symbol" />
            ) : (
              <ICPIcon className="token-symbol" />
            )}
            Standard:<span style={{ color: 'grey' }}>{token.standard}</span>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <Container padding="16px">
        Transaction type: <span style={{ color: 'grey' }}>{type_txn}</span>
      </Container>
      <HR marginTop="8px" marginBottom="8px" />
      <Container padding="16px">
        <Grid columns={2}>
          <Grid column={1}>
            Mint from:
            <br />
            <span style={{ color: 'grey' }}>{mint_from}</span>
          </Grid>
          <Grid column={2}>
            Mint to:
            <br />
            <span style={{ color: 'grey' }}>{mint_to}</span>
          </Grid>
        </Grid>
      </Container>
      <HR marginTop="8px" marginBottom="8px" />
      {display_token_config}
    </Container>
  );
};
