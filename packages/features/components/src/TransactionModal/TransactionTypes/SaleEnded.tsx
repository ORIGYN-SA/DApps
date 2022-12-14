import React from 'react';
import { Grid, Container, HR } from '@origyn-sa/origyn-art-ui';
// Icons ICP & OGY
import {ICPIcon, OGYIcon} from '@dapp/common-assets';

export const SaleEnded = (props : any) => {
  const {
    seller,
    buyer,
    amount,
    token
  } = props.data;

  return (

    <Container>
      <Container padding="16px">
        
          Transaction type:<br/>
          {props.data.type_txn}
          <br/>
          Sale ID:<br/>
          {props.data.sale}
        
      </Container>
      <HR marginTop="8px" marginBottom="8px" />
      <Container padding="16px">
        <Container>
        Amount:<br/>
        {amount}
        </Container>
        <Grid columns>
          <Grid column={1}>
            
              Buyer:<br/>{buyer.acc_principal_string}
          </Grid>
          <Grid column={2}>
            
              Seller:<br/>{seller.acc_principal_string}
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Grid columns={2}>
          <Grid column={1}>
            Canister:<br/>{token.canister_string}<br/>
             Fee:<br/>{token.fee}<br/>
            Decimals: <br/>{token.decimal}<br/>
          </Grid>
          <Grid column={2}>
             Symbol:<br/>{token.symbol === 'OGY' ? (
                <OGYIcon className="token-symbol" />
              ) : (
                <ICPIcon className="token-symbol" />
              )}
            <br/>
            
              Standard:<br/>{token.standard}
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};
