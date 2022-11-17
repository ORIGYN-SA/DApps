import React, { useContext, useEffect, useState } from 'react';
import { render, fireEvent, waitFor, screen,cleanup } from '../../../../../../testUtils';
import '@testing-library/jest-dom';
import { AuthContext } from '@dapp/features-authentication';
import { SearchbarNft } from '../index';

describe('Select-Autocomplete', () => {
  // Render
  render(<SearchbarNft isLoading={true}/>);
  // Test1
  const Loader = screen.getByRole('progressbar');
  test('If is loading should display only preloader', () => {
    expect(Loader).toBeInTheDocument();
  }
  );
  // Test2
  test('If is not loading should display the SEARCHBAR', () => {
    render(<SearchbarNft isLoading={false}/>);
    const Searchbar = screen.getByLabelText('Other tokens IDS');
    expect(Searchbar).toBeInTheDocument();
  }
  );
  // Test3
  // test searchbar is rendered and match snapshot
  test('Searchbar is rendered and match snapshot', () => {
    const { asFragment } = render(<SearchbarNft isLoading={false} searchBarTokenId={'#myId'}/>);
    expect(asFragment()).toMatchSnapshot();
    cleanup()
  }
  );
  // Test4
  //pass properties to the component
  test('Searchbar is rendered with the token ID', () => {
    const { asFragment } = render(<SearchbarNft isLoading={false} searchBarTokenId={'#myId'} />);
    expect(asFragment()).toMatchSnapshot();
    cleanup();
  }
  );
  
  // Test5
  // if autocomplete is open and user click on the item, the item should be selected
  test('If autocomplete is open and user click on the item, the item should be selected', async () => {
    const { asFragment } = render(<SearchbarNft isLoading={false} searchBarTokenId={'#myId'} />);
    const Searchbar = screen.getByLabelText('Other tokens IDS');
    fireEvent.focus(Searchbar);
    const Item = screen.getByText('#myId');
    fireEvent.click(Item);
    expect(Searchbar.value).toBe('#myId');
  });

  // Test6
  // if the token id is not selected, the searchbar value should be 'Not selected'
  test('If the token id is not selected, the searchbar value should be \'Not selected\'', async () => {
    const { asFragment } = render(<SearchbarNft isLoading={false} searchBarTokenId={'Not selected'} />);
    const Searchbar = screen.getByLabelText('Other tokens IDS');
    expect(Searchbar.value).toBe('Not selected');
  }  
  );

  // Test7 
  // when user click on the searchbar, the autocomplete should be open
  test('When user click on the searchbar, the autocomplete should be open', async () => {
    const { asFragment } = render(<SearchbarNft isLoading={false} searchBarTokenId={'Not selected'} />);
    const Searchbar = screen.getByLabelText('Other tokens IDS');
    fireEvent.focus(Searchbar);
    expect(Searchbar.value).toBe('Not selected');
  });
  // Test8
  test('Take a snapshot of the component', () => {
    const { asFragment } = render(<SearchbarNft isLoading={false} searchBarTokenId={'Not selected'} />);
    expect(asFragment()).toMatchSnapshot();
    cleanup();
  }
  );
  // Test9
  test('The snapshot should match', () => {
    const { asFragment } = render(<SearchbarNft isLoading={false} searchBarTokenId={'Not selected'} />);
    expect(asFragment()).toMatchSnapshot();
    cleanup();
  }
  );
});
