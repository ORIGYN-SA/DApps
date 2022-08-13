import { padNum } from './number';
import { formatTime } from './dateTime';

export const format_data = (_date_int: string) => {
    const formatted_data = formatTime(BigInt(_date_int));
    return formatted_data;
  }