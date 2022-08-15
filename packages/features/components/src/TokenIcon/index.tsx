import React from 'react';
import { ICPIcon, OGYIcon, QuestionIcon } from '@dapp/common-assets';

const iconStyle = {
  verticalAlign: 'middle',
  width: '20px',
  height: '20px',
  marginRight: '3px',
  borderRadius: '25px',
  backgroundColor: 'black',
};
export const TokenIcon = ({ symbol }: any) => {
  if (
    typeof symbol === 'string' &&
    (symbol.indexOf('https://') !== -1 || symbol.indexOf('data:image') !== -1)
  )
    return <img style={iconStyle} src={symbol} />;

  if (typeof symbol === 'string') symbol = symbol.toUpperCase();
  const Component = {
    OGY: <OGYIcon style={iconStyle} data-testid="ogy-icon" />,
    ICP: <ICPIcon style={iconStyle} data-testid="icp-icon" />,
  };
  if (Component?.hasOwnProperty(symbol)) return Component[symbol];

  return (
    <QuestionIcon
      style={{
        width: '20px',
        height: '20px',
        fill: 'gray',
      }}
      data-testid="question-icon"
    />
  );
};
