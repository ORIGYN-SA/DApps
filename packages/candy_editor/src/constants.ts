export const NOT_SELECTED = null;
export const SELECT_OPTIONS = [
  { label: 'Text', value: 'Text' },
  { label: 'Nat', value: 'Nat' },
  { label: 'Nat8', value: 'Nat8' },
  { label: 'Nat16', value: 'Nat16' },
  { label: 'Nat32', value: 'Nat32' },
  { label: 'Nat64', value: 'Nat64' },
  { label: 'Nats', value: 'Nats' },
  { label: 'Int', value: 'Int' },
  { label: 'Int8', value: 'Int8' },
  { label: 'Int16', value: 'Int16' },
  { label: 'Int32', value: 'Int32' },
  { label: 'Int64', value: 'Int64' },
];

export const VALIDATION_ERRORS = {
  NAT: 'The value must be a Nat number.',
  NAT8: 'The value must be a Nat number between 0 and 255',
  NAT16: 'The value must be a Nat number between 0 and 65535',
  NAT32: 'The value must be a Nat number between 0 and 4294967295',
  NAT64: 'The value must be a Nat number between 0 and 18446744073709551615',
  INT: 'The value must be a Int number',
  INT8: 'The value must be a Int number between -128 and 127',
  INT16: 'The value must be a Int number between -32768 and 32767',
  INT32: 'The value must be a Int number between -2147483648 and 2147483647',
  INT64: 'The value must be a Int number between -9223372036854775808 and 9223372036854775807',
};
