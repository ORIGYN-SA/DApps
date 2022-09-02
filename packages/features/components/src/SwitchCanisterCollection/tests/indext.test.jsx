import React from 'react';
import '@testing-library/jest-dom';
import { SwitchCanisterCollection } from '../index';
import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
  getByText,
  getByDisplayValue,
  getByRole,
  getByTestId,
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

const log = jest.spyOn(console, "log").mockImplementation(() => {});

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

  // test3
  // fire click event on button
  test('Fire button', async () => {
    const { getByTestId } = render(<Wrapper />);
    expect(async () => await fireEvent.click(getByTestId('switch-canister-button'))).toBeTruthy();
  });

  // test4
  // if nothing is fired, console.log must be empty

  test('No log if nothing is fired', async () => {
    // TODO: test something that should not log
    await expect(log).not.toHaveBeenCalled();
  });

  // test5
  // if button is fired with wrong canister console.log must be called
  test('Call log when canister is wrong', async () => {
    const { getByTestId } = render(<Wrapper />);
    fireEvent.click(getByTestId('switch-canister-button'));
    await waitFor(() => expect(log).toHaveBeenCalled());
  });

  // test6
  // if button is fired, console.log must be called with the correct message
  // example invalid canister
  test('Call log with correct message', async () => {
    const { getByTestId } = render(<Wrapper />);
    fireEvent.click(getByTestId('switch-canister-button'));
    await waitFor(() => expect(log).toHaveBeenCalledWith('Not a valid canister'));
  });

  // test7
  // if we have correct canister console.log must be not called
  test('No log when canister is correct', async () => {
    const { getByTestId } = render(<Wrapper />);
    const textField = getByTestId('switch-canister-textfield');
    textField.value = NEWCANISTER;
    async () => fireEvent.click(getByTestId('switch-canister-button'));
    await waitFor(() => expect(log).not.toHaveBeenCalled());
  });
});
