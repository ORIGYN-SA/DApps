import { format_data } from "../formatData";

const bigIntString = '1519778444938790';
const formattedData =  "18/01/1970 03:09pm";

describe("utils > formatData", () => {
  it('should return a formatted Data from a BIGINT string', () => {
    expect(format_data(bigIntString)).toBe(formattedData);
  });
});