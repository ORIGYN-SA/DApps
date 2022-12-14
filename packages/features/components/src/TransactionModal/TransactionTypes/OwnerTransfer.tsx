import React from 'react';
import { Grid, Container, HR } from '@origyn-sa/origyn-art-ui';

export const OwnerTransfer = (props: any) => {
  const { type_txn, from, to } = props.data;

  return (
    <Container>
      <Container padding="16px">Transaction type: {type_txn}</Container>
      <HR marginTop="8px" marginBottom="8px" />
      <Grid columns={2}>
        <Grid column={1}>
          Transfer from:
          <br />
          {from.acc_principal_string}
        </Grid>
        <Grid column={2}>
          Transfer to:
          <br />
          {to.acc_principal_string}
        </Grid>
      </Grid>
    </Container>
  );
};
