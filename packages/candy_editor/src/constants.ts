import { EditorMode } from "./types";

export const NOT_SELECTED: string = null;
export const CREATE_MODE: EditorMode = 'create';
export const EDIT_MODE: EditorMode = 'edit';

export const SELECT_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Text', value: 'Text' },
  { label: 'Nat', value: 'Nat' },
  { label: 'Nat8', value: 'Nat8' },
  { label: 'Nat16', value: 'Nat16' },
  { label: 'Nat32', value: 'Nat32' },
  { label: 'Nat64', value: 'Nat64' },
  { label: 'Int', value: 'Int' },
  { label: 'Int8', value: 'Int8' },
  { label: 'Int16', value: 'Int16' },
  { label: 'Int32', value: 'Int32' },
  { label: 'Int64', value: 'Int64' },
  { label: 'Bool', value: 'Bool' },
  { label: 'Float', value: 'Float' },
  { label: 'Principal', value: 'Principal' },
  { label: 'Bytes', value: 'Bytes' },
];

export const VALIDATION_ERRORS: { [key: string]: string } = {
  nat: 'The value must be a Nat number',
  nat8: 'The value must be a Nat number between 0 and 255',
  nat16: 'The value must be a Nat number between 0 and 65535',
  nat32: 'The value must be a Nat number between 0 and 4294967295',
  nat64: 'The value must be a Nat number between 0 and 18446744073709551615',
  int: 'The value must be a Int number',
  int8: 'The value must be a Int number between -128 and 127',
  int16: 'The value must be a Int number between -32768 and 32767',
  int32: 'The value must be a Int number between -2147483648 and 2147483647',
  int64: 'The value must be a Int number between -9223372036854775808 and 9223372036854775807',
  boolean: 'The value must be a Boolean (true or false - case insensitive)',
  float: 'The value must be a Float number',
  principal: 'The value must be a valid Principal',
};
