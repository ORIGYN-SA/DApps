import React from 'react';
import styled from 'styled-components';

export const Disclaimer = () => {
  return <StyledDisclaimer>This is pre-release software. Use at your own risk.</StyledDisclaimer>;
};

const StyledDisclaimer = styled.div`
  background-color: #ab8500;
  color: white;
  padding: 5px;
  text-align: center;
`;
