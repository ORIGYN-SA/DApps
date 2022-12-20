import React from 'react';
// Icons ICP & OGY
import { ICPIcon } from '@dapp/common-assets';
import { OGYIcon } from '@dapp/common-assets';
import { Grid,Container, HR} from '@origyn-sa/origyn-art-ui';


export const AuctionBid = (props: any) => {
  const { type_txn, buyer, amount, token, sale_id } = props.data;

  return (
    <>
    <Container>
      <Container padding="16px">
          Transaction type: 
          <br/>
          <span style={{color: 'grey'}}> {type_txn}</span>
          <br/>
          Sale ID:
          <br/>
          <span style={{color: 'grey'}}> {sale_id}</span>
        </Container>
        <HR marginTop="8px" marginBottom="8px" />
        <Grid columns={2}>
          <Grid column={1}>
              Buyer: <span style={{color: 'grey'}}>{buyer.acc_principal_string}</span>
          </Grid>
          <Grid column={2}>
              Amount: <span style={{color: 'grey'}}>{amount}</span>
          </Grid>
        </Grid>
      </Container>
      <Container padding="16px">
        <Grid columns={2}>
          <Grid column={1}>
              Canister: <span style={{color: 'grey'}}>{token.canister_string}</span>
              <br/>
              Fee: <span style={{color: 'grey'}}>{token.fee}</span>
         <br/>
              Decimals: <span style={{color: 'grey'}}>{token.decimal}</span>
          </Grid>
          <Grid column={2}>
              Symbol: {token.symbol === 'OGY' ? (
                <OGYIcon className="token-symbol" />
              ) : (
                <ICPIcon className="token-symbol" />
              )}
            
              Standard: <span style={{color: 'grey'}}>{token.standard}</span>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
