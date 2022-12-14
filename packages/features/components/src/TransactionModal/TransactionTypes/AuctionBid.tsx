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
          {type_txn}
          Sale ID:
          <br/>
          {sale_id}
        </Container>
        <HR marginTop="8px" marginBottom="8px" />
        <Grid columns={2}>
          <Grid column={1}>
              Buyer: {buyer.acc_principal_string}
          </Grid>
          <Grid column={2}>
              Amount: {amount}
          </Grid>
        </Grid>
      </Container>
      <Container padding="16px">
        <Grid columns={2}>
          <Grid column={1}>
              Canister: {token.canister_string}
              <br/>
              Fee: {token.fee}
         <br/>
              Decimals: {token.decimal}
          </Grid>
          <Grid column={2}>
              Symbol: {token.symbol === 'OGY' ? (
                <OGYIcon className="token-symbol" />
              ) : (
                <ICPIcon className="token-symbol" />
              )}
            
              Standard: {token.standard}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
