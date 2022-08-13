import { padNum } from './number';
const formatTime = (timestamp: bigint) => {
  let apm = 'am';

  const a = new Date(Number(timestamp / 1000000n));
  const year = a.getFullYear();
  const month = padNum(a.getMonth() + 1);
  const date = padNum(a.getDate());
  const hour = padNum(a.getHours() % 12);
  const min = padNum(a.getMinutes());
  const sec = padNum(a.getSeconds());
  apm = a.getHours() / 12 >= 1 ? 'pm' : 'am';
  const time = `${hour}:${min}`;
  return `${date}/${month}/${year} ${time}${apm}`;
};

export const format_data = (_date_int: string) => {
    const formatted_data = formatTime(BigInt(_date_int));
    return formatted_data;
  }