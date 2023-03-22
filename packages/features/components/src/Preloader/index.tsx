import React from 'react';
import styled from 'styled-components';
import { LoadingBar } from '@origyn/origyn-art-ui';

const StyledPreloader = styled.div`
  width: ${({ width }) => width || '100vw'};
  height: ${({ height }) => height || '100vh'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Preloader = (props) => (
  <StyledPreloader {...props}>
    <LoadingBar />
  </StyledPreloader>
);
