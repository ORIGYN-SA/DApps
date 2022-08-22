import { format_data } from "../formatData";

const bigIntString = "1519778444938790";
const formattedData =  "18/01/1970 03:09pm";

describe("utils > formatData", () => {
  //should return formatted data
  it("should return formatted data", () => {
    expect(format_data(bigIntString)).toMatch(formattedData);
  } );
});
