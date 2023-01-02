export const isLocal = () => {
  return (
    process.env.isLocal &&
    (window.location.hostname.indexOf('localhost') !== -1 ||
      window.location.hostname.indexOf('127.0.0.1') !== -1)
  );
};

export function numberWithCommas(number: number, separator = ',') {
  // Split float on "."
  const numbers = number.toString().split('.');

  // TODO: consider adding comas to amount >0&<1
  return (
    numbers[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator) +
    (numbers[1] ? `.${numbers[1]}` : '')
  );
}

export const formatE8S = (e8s: BigInt) => {
  const n = e8s.toString().padStart(9, '0');

  return [n.slice(0, -8), '.', n.slice(-8)].join('');
};

export const copyToClipboard = (text: string, onSuccess?: () => void) => {
  navigator.clipboard.writeText(text).then(function () {
    onSuccess();
    console.log('Async: Copying to clipboard was successful!');
  });
};

export const formatDate = (date: Date) => {
  const month_names_short = [
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
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${day} ${month_names_short[month]}, ${year}`;
};
export const parseDate = (ts) => {
  const time = Number(ts);
  const timeInSeconds = Math.floor(time / 1000000);
  const d = new Date(timeInSeconds);
  return d;
};

export * from './binary';
export * from './dateTime';
export * from './idl';
export * from './ledger';
export * from './number';
export * from './principalToAccountID';
export * from './useLocalStorage';
export * from './collectionName';
export * from './interfaces';
export * from './checkCanister';
export * from './getFormattedLink';
export * from './checkOwner';
export * from './random';
