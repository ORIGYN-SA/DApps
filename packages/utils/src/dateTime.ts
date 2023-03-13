import { padNum } from './number';

export const timeInNanos = (): BigInt => {
  return BigInt(new Date().getTime() * 1e6);
};

export const timeConverter = (timestamp: bigint) => {
  const a = new Date(Number(timestamp / 1000000n));
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = ('0' + a.getHours()).slice(-2);
  const min = ('0' + a.getMinutes()).slice(-2);
  const sec = a.getSeconds();

  const time = hour + ':' + min;
  return date + '/' + month + '/' + year + ' ' + time;
};

export const getDiffInDays = (expirationDate, end_date = new Date()) => {
  let curDate = end_date;
  let expDate = new Date(timeConverter(expirationDate));
  let diff = curDate.getTime() - expDate.getTime();
  let diffInHrs = Math.abs(diff) / (1000 * 3600);
  let endStr = '';
  if (diffInHrs < 24) {
    endStr = `${Math.floor(diffInHrs)}hrs`;
  } else {
    if (diffInHrs >= 24 * 30) {
      endStr = `${
        Math.floor(diffInHrs / 24 / 30) + Math.ceil((Math.floor(diffInHrs / 24) % 30) / 30)
      } month(s)`;
    } else {
      endStr = `${Math.floor(diffInHrs / 24)} days`;
    }
  }
  if (diff > 0) {
    return `${endStr} ago`;
  }
  return `Ends in ${endStr}`;
};

export const formatTime = (timestamp: bigint) => {
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
