import type { Principal } from '@dfinity/principal';

export type CandyValue =
  | { Empty: null }
  | { Bool: boolean }
  | { Text: string }
  | { Nat: bigint }
  | { Nat8: number }
  | { Nat16: number }
  | { Nat32: number }
  | { Nat64: bigint }
  | { Nats: { thawed: Array<bigint> } | { frozen: Array<bigint> } }
  | { Int: bigint }
  | { Int8: number }
  | { Int16: number }
  | { Int32: number }
  | { Int64: bigint }
  | { Floats: { thawed: Array<number> } | { frozen: Array<number> } }
  | { Float: number }
  | { Blob: Array<number> }
  | { Bytes: { thawed: Array<number> } | { frozen: Array<number> } }
  | { Option: [] | [CandyValue] }
  | { Principal: Principal }
  | {
    Array: { thawed: Array<CandyValue> } | { frozen: Array<CandyValue> };
  }
  | { Class: Array<Property> };

export interface Property {
  value: CandyValue;
  name: string;
  immutable: boolean;
}

export interface CandyClassEditor {
  addPropertyToCandyClass : (property: Property) => void;
};