import { format_data } from "../formatData";

const bigIntNum = 1519778444938790;
const formattedData =  "18/01/1970 03:09pm";

describe("utils > formatData", () => {
  //should return a string with the date formatted
  it("should return a string with the date formatted", () => {
    expect(format_data(bigIntNum)).toEqual(formattedData);
  }
  );
});
