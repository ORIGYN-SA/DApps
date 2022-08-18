import { TokenIcon } from './index';
import React from 'react';
import { render } from '@testUtils';
import '@testing-library/jest-dom';

describe('Components > TokenIcon', () => {
  it('displays an image with source if url provided', () => {
    const url = 'https://example.com/image.png';
    const { getByRole } = render(<TokenIcon symbol={url} />);
    const image = getByRole('img');
    expect(image.src).toBe(url);
  });

  it('displays the OGY icon if OGY symbol', () => {
    const { getByTestId } = render(<TokenIcon symbol={'OGY'} />);
    expect(getByTestId('ogy-icon')).toBeInTheDocument();
  });

  it('displays the ICP icon if ICP symbol', () => {
    const { getByTestId } = render(<TokenIcon symbol={'ICP'} />);
    expect(getByTestId('icp-icon')).toBeInTheDocument();
  });

  it('displays the qestion mark icon if unknown symbol', () => {
    const { getByTestId } = render(<TokenIcon symbol={'invalid'} />);
    expect(getByTestId('question-icon')).toBeInTheDocument();
  });
});
