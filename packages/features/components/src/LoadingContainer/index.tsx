import React from 'react';
import { Container, Flex, LoadingBar } from '@origyn/origyn-art-ui';

interface LoadingContainerProps {
  margin?: string;
}

export const LoadingContainer = ({ margin }: LoadingContainerProps) => (
  <div style={{ marginTop: margin, marginBottom: margin }}>
    <Flex justify="center" align="center">
      <LoadingBar />
    </Flex>
  </div>
);
