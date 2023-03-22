import React from 'react';
import { Flex, LoadingBar, Container } from '@origyn/origyn-art-ui';

interface LoadingContainerProps {
  margin?: string;
}

export const LoadingContainer = ({ margin }: LoadingContainerProps) => (
  <Container>
    <div style={{ marginTop: margin, marginBottom: margin }}>
      <Flex justify="center" align="center">
        <LoadingBar />
      </Flex>
    </div>
  </Container>
);
