import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { LoadingBar } from '@origyn/origyn-art-ui';

interface StyledPreloaderProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

const StyledPreloader = styled.div<StyledPreloaderProps>`
  width: ${({ width }) => width || '100vw'};
  height: ${({ height }) => height || '100vh'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Preloader: React.FC<StyledPreloaderProps> = (props) => (
  <StyledPreloader {...props}>
    <LoadingBar />
  </StyledPreloader>
);
