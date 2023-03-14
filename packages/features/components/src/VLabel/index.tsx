import React from 'react';
import { Container } from '@origyn/origyn-art-ui';
export const VersionLabel = (props: any) => {
  const VNumber: string = props.ledgerVersion;

  return <Container>LEDGER - {VNumber}</Container>;
};
