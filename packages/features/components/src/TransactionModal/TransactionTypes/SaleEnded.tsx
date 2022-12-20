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
          <span style={{color: 'grey'}}>{props.data.type_txn}</span>
          <br/>
          Sale ID:<br/>
          <span style={{color: 'grey'}}>{props.data.sale}</span>
        
      </Container>
      <HR marginTop="8px" marginBottom="8px" />
      <Container padding="16px">
        <Container>
        Amount:<br/>
        <span style={{color: 'grey'}}>{amount}</span>
        </Container>
        <Grid columns>
          <Grid column={1}>
            
              Buyer:<br/> <span style={{color: 'grey'}}>{buyer.acc_principal_string}</span>
          </Grid>
          <Grid column={2}>
            
              Seller:<br/> <span style={{color: 'grey'}}>{seller.acc_principal_string}</span>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Grid columns={2}>
          <Grid column={1}>
            Canister:<br/> <span style={{color: 'grey'}}>{token.canister_string}</span><br/>
             Fee:<br/> <span style={{color: 'grey'}}>{token.fee}</span><br/>
            Decimals: <br/> <span style={{color: 'grey'}}>{token.decimal}</span><br/>
          </Grid>
          <Grid column={2}>
             Symbol:<br/>{token.symbol === 'OGY' ? (
                <OGYIcon className="token-symbol" />
              ) : (
                <ICPIcon className="token-symbol" />
              )}
            <br/>
            
              Standard:<br/> <span style={{color: 'grey'}}>{token.standard}</span>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};
