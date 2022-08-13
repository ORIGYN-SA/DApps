import { removeDuplicates } from "../removeDuplicates";

const array_with_dupl = [0,0,0,1,1,1,2,2,2,2,3,3,3,4,5,6,7,7,7,7,'dog','dog','cat'];
const array_no_dupl = [0,1,2,3,4,5,6,7,'dog','cat'];

describe("utils > removeDuplicates", () => {
    it('should return an array without duplicates', () => {
      expect(removeDuplicates(array_with_dupl)).toStrictEqual(array_no_dupl);
    });
  });