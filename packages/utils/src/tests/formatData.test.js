import { format_data } from "../formatData";

const bigIntString = "1519778444938790";
const formattedData =  "18/01/1970 02:09pm";

describe("utils > formatData", () => {
  //should return a string with the date formatted
  it("should return a string with the date formatted", () => {
    expect(format_data(bigIntString)).toEqual(formattedData);
  }
  );
});
