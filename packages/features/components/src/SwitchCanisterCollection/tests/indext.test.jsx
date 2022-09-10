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

async function getUrl(){
  return window.location.href;
}

describe('Features > Component > SwitchCanisterCollection', () => {
  afterAll(() => {})
  beforeEach(() => jest.resetAllMocks());
  const { getByLabelText,getByRole } = render(<Wrapper />);
  const textField = getByLabelText('Switch Canister');
  const button = getByRole('button');

  // test1
  test('SwitchCanisterCollection renders', async () => {
    textField.value = NEWCANISTER;
    expect(textField).toBeInTheDocument();
    expect(textField).toBeEnabled();
  });
  // test2
  test('The Url is mocked', async () => {
    return getUrl().then((data) => {
      expect(data).toBe('http://localhost:8080/-/s32s7-zqaaa-aaaaj-afksa-cai/-/ledger');
    });
  })
  // test3
  test('The Url is not changed if canister is invalid', async () => {
    button.click();
    return getUrl().then(async (data) => {
      expect(data).toBe('http://localhost:8080/-/s32s7-zqaaa-aaaaj-afksa-cai/-/ledger');
    }
    );
  });  
  // test4
  test('If user write in the input a valid canister and click the switch button, the URL should be updated', async () => {
    textField.value = NEWCANISTER;
    button.click();
    const CUR_URL = await getUrl();
    waitFor(async () => {
      expect(textField.value).toBe(NEWCANISTER);
      expect(button).toBeEnabled();
      expect(CUR_URL).toBe('http://localhost:8080/-/frfol-iqaaa-aaaaj-acogq-cai/-/ledger');
    }
    );
  }); 
});
