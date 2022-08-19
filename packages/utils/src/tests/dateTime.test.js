import { getDiffInDays, timeConverter, formatTime } from '../dateTime';

describe('Utils > Date Time', () => {
  it('timeConverter converts correct date from Nat', () => {
    const INPUT_TEST_DATE = 1660210980000000000n;
    const RESULT = /11\/Aug\/2022 [0-9]{2}:43/g;

    const readableDate = timeConverter(INPUT_TEST_DATE);
    expect(RESULT.test(readableDate));
  });

  it('getDiffInDays returns correct', () => {
    const INPUT_TEST_DATE_DOWN = 1660210980000000000n;
    const INPUT_TEST_DATE_UP = new Date(timeConverter(1650010230000000000n));
    const RESULT = 'Ends in 4 month(s)';

    const diffInDays = getDiffInDays(INPUT_TEST_DATE_DOWN, INPUT_TEST_DATE_UP);
    expect(diffInDays).toBe(RESULT);
  });

  it('formatTime formats time correctly', () => {
    const INPUT_TEST_DATE = 1660210980000000000n;
    const RESULT = /11\/08\/2022 [0-9]{2}:43(am|pm)/g;

    const formattedTime = formatTime(INPUT_TEST_DATE);
    expect(RESULT.test(formattedTime));
  });
});
