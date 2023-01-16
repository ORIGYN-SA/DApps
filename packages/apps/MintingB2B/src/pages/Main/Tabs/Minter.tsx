import React from 'react';
import { LoadingContainer } from '@dapp/features-components';
import { Button, Container, Grid, HR } from '@origyn-sa/origyn-art-ui';
import { Form as MetadataForm } from '../../../components/forms';

export const Minter = ({ isMinting, mintNft, dataStructure }: Props) => {
  return (
    <Container padding="16px">
      <br />
      <h2>Minter</h2>
      <br />
      <form onSubmit={mintNft}>
            <Grid columns={2}>
              <div>
                <h6>Mint a new Certificate</h6>
                <br />
                <p>Manually enter all the fields and upload any necessary images and documents to complete the minting process.</p>
              </div>
              <Button type="submit">Continue</Button>
            </Grid>
            <HR />
            <MetadataForm data={dataStructure} />
            <br />
      </form>
    </Container>
  );
};

type Props = {
  isMinting: boolean;
  mintNft: any;
  dataStructure: any;
};
