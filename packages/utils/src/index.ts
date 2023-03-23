BigInt.prototype['toJSON'] = function () {
  return this.toString();
};

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

export const getRootUrl = (url: URL): string => {
  if (
    ['prptl.io', 'exos.origyn.network', 'localhost:3000', 'localhost:8080'].includes(url.host)
  ) {
    // https://prptl.io/-/{canister_id}
    // https://prptl.io/-/{collection_id}
    // http://localhost:3000/-/{canister_id}
    // http://localhost:3000/-/{collection_id}
    return url.origin + url.pathname.split('/').slice(0, 3).join('/');
  } else {
    // https://{canister_id}.raw.ic0.app
    // http://{canister_id}.localhost:8000
    return url.origin;
  }
}

export * from './interfaces';
export * from './binary';
export * from './dateTime';
export * from './idl';
export * from './ledger';
export * from './number';
export * from './principalToAccountID';
export * from './useLocalStorage';
export * from './collectionName';
export * from './checkCanister';
export * from './getFormattedLink';
export * from './checkOwner';
export * from './metadataParser';
export * from './binaryConverters';

