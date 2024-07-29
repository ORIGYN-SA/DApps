import React from 'react';
import { Grid, Container, HR } from '@origyn/origyn-art-ui';

export const OwnerTransfer = (props: any) => {
  const { type_txn, from, to } = props.data;

  return (
    <Container>
      <Container padding="16px">Transaction type: {type_txn}</Container>
      <HR marginTop={8} marginBottom={8} />
      <Grid columns={1}>
        <Grid columns={1}>
          Transfer from:
          <br />
          <span style={{ color: 'grey' }}>{from.acc_principal_string}</span>
          <br />
          Transfer to:
          <br />
          <span style={{ color: 'grey' }}>{to.acc_principal_string}</span>
        </Grid>
      </Grid>
    </Container>
  );
};
