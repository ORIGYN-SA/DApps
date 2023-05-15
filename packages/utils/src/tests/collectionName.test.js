import { collectionName } from '../collectionName';
delete global.window.location;
global.window = Object.create(window);
const NAME = 'baycdev';

describe('utils > CollectionName', () => {
  it('should return the collectionName in the URL', () => {
    // Mock window.location
    global.window.location = {
      href: 'http://localhost:8080/-/dytv5-jaaaa-aaaal-qbgtq-cai/collection/-/ledger',
      pathname: '/-/baycdev/collection/-/ledger/',
    };

    expect(collectionName('')).toBe(NAME);
  });

  it('should return undefined, token id = #mytoken as argument', () => {
    // Mock window.location
    global.window.location = {
      href: 'http://localhost:8080/-/dytv5-jaaaa-aaaal-qbgtq-cai/-/ledger',
      pathname: '/-/baycdev/-/ledger/',
    };

    expect(collectionName()).toBe(undefined);
  });
});
