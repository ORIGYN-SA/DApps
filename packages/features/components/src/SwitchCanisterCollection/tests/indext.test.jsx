import React from 'react';
import '@testing-library/jest-dom';
import { SwitchCanisterCollection } from '../index';
import {
  render, waitFor
} from '../../../../../../testUtils';
import { SnackbarProvider } from 'notistack';

//Mock the URL
delete global.window.location;
global.window = Object.create(window);
global.window.location = {};
// Mock window.location
global.window.location = {
  href: 'http://localhost:8080/-/s32s7-zqaaa-aaaaj-afksa-cai/-/ledger',
  pathname: '/-/s32s7-zqaaa-aaaaj-afksa-cai/-/ledger/',
};

const NEWCANISTER = 'frfol-iqaaa-aaaaj-acogq-cai';

const Wrapper = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <SwitchCanisterCollection />
    </SnackbarProvider>
  );
};
describe('Features > Component > SwitchCanisterCollection', () => {
 
  beforeEach(() => jest.resetAllMocks());

  afterAll(() => {
    console.log = console.log; // restore original console.log after all tests
  });

  // test1
  // check if textField is rendered
  test('SwitchCanisterCollection renders', async () => {
    const { getByLabelText } = render(<Wrapper />);
    const textField = getByLabelText('Switch Canister');
    textField.value = NEWCANISTER;
    expect(textField).toBeInTheDocument();
    expect(textField).toBeEnabled();
  });

  // test2
  // check if button is rendered
  test('SwitchCanisterCollection renders', () => {
    const { getByTestId } = render(<Wrapper />);
    const button = getByTestId('switch-canister-button');
    expect(button).toBeInTheDocument();
  });
  async function getUrl(){
    return window.location.href;
  }
  async function fireButton(){
    const { getByTestId } = render(<Wrapper />);
    const button = getByTestId('switch-canister-button');
    return button.click();
  }
  
  // test3
  // Test if URL is mocked
  test('The Url is mocked', async () => {
    return getUrl().then((data) => {
      expect(data).toBe('http://localhost:8080/-/s32s7-zqaaa-aaaaj-afksa-cai/-/ledger');
    });
  })
  // test4
  // If the canister is not valid and button is clicked, URL should not change
  test('The Url is not changed if canister is invalid', async () => {
    await fireButton();
    await getUrl();
    return getUrl().then(async (data) => {
      expect(data).toBe('http://localhost:8080/-/s32s7-zqaaa-aaaaj-afksa-cai/-/ledger');
    }
    );
  });  
  

});
