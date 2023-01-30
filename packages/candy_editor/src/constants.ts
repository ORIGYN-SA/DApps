export const NOT_SELECTED = 'Not selected';
export const SELECT_OPTIONS = [
  { label: 'Text', value: 'Text' },
  { label: 'Nat', value: 'Nat' },
  { label: 'Nat8', value: 'Nat8' },
  { label: 'Nat16', value: 'Nat16' },
  { label: 'Nat32', value: 'Nat32' },
  { label: 'Nat64', value: 'Nat64' },
  { label: 'Nats', value: 'Nats' },
];

export const VALIDATION_ERRORS = {
  NAT: 'The value must be a Nat number.',
  NAT8: 'The value must be a Nat number between 0 and 255',
  NAT16: 'The value must be a Nat number between 0 and 65535',
  NAT32: 'The value must be a Nat number between 0 and 4294967295',
  NAT64: 'The value must be a Nat number between 0 and 18446744073709551615',
};
