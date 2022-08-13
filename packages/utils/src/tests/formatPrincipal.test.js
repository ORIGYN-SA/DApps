import { formatPrincipal } from "../formatPrincipal";
import testData from './data'

const formattedPrincipal = "6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe";

describe("utils > formatPrincipal", () => {
  it('should return a formatted Principal', () => {
    expect(formatPrincipal(testData.formatPrincipal.Uint8Array)).toBe(formattedPrincipal);
  });
});