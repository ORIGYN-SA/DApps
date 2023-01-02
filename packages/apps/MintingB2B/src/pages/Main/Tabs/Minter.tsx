import React from 'react';
import { LoadingContainer } from '@dapp/features-components';
import { Container } from '@origyn-sa/origyn-art-ui';

export const Minter = ({ isMinting, tabs, content }: Props) => {
  return (
    <Container padding="16px">
      <br />
      <h2>Minter</h2>
      <br />
      {tabs}
      {isMinting ? <LoadingContainer /> : content}
    </Container>
  );
};

type Props = {
  isMinting: boolean;
  tabs: any;
  content: JSX.Element;
};
