import type { Principal } from '@dfinity/principal';

export type CandyValue =
  | { Int: bigint }
  | { Nat: bigint }
  | { Empty: null }
  | { Nat16: number }
  | { Nat32: number }
  | { Nat64: bigint }
  | { Blob: Array<number> }
  | { Bool: boolean }
  | { Int8: number }
  | { Nat8: number }
  | { Nats: { thawed: Array<bigint> } | { frozen: Array<bigint> } }
  | { Text: string }
  | { Bytes: { thawed: Array<number> } | { frozen: Array<number> } }
  | { Int16: number }
  | { Int32: number }
  | { Int64: bigint }
  | { Option: [] | [CandyValue] }
  | { Floats: { thawed: Array<number> } | { frozen: Array<number> } }
  | { Float: number }
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

