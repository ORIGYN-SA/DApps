import { collectionName } from "../collectionName";
delete global.window.location;
global.window = Object.create(window);
global.window.location = {};
// Mock window.location
global.window.location = {
  href: 'http://localhost:8080/-/baycdev/collection/-/ledger',
  pathname : '/-/baycdev/collection/-/ledger/'
};

const NAME = "baycdev";

describe("utils > CollectionName", () => {
  it('should return the collectionName in the URL', () => {
    expect(collectionName('')).toBe(NAME);
  });

  it('should return undefined, token id = #mytoken as argument',()=>{
    expect(collectionName('#mytoken')).toBe(undefined);
  });
});