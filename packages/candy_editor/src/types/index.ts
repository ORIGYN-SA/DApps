import type { Principal } from '@dfinity/principal';

export interface CandyType {}

export interface Property {
  value: CandyType;
  name: string;
  immutable: boolean;
}

export interface CandyEmpty extends CandyType {
  Empty: null;
}
export interface CandyClass extends CandyType {
  Class: Array<Property>;
}
export interface CandyText extends CandyType {
  Text: string;
}
export interface CandyNat extends CandyType {
  Nat: bigint;
}
export interface CandyBool extends CandyType {
  Bool: boolean;
}
export interface CandyNat8 extends CandyType {
  Nat8: number;
}
export interface CandyNat16 extends CandyType {
  Nat16: number;
}
export interface CandyNat32 extends CandyType {
  Nat32: number;
}
export interface CandyNat64 extends CandyType {
  Nat64: bigint;
}
export interface CandyNats extends CandyType {
  Nats: { thawed: Array<bigint> } | { frozen: Array<bigint> };
}
export interface CandyInt extends CandyType {
  Int: bigint;
}
export interface CandyInt8 extends CandyType {
  Int8: number;
}
export interface CandyInt16 extends CandyType {
  Int16: number;
}
export interface CandyInt32 extends CandyType {
  Int32: number;
}
export interface CandyInt64 extends CandyType {
  Int64: bigint;
}
export interface CandyFloats extends CandyType {
  Floats: { thawed: Array<number> } | { frozen: Array<number> };
}
export interface CandyFloat extends CandyType {
  Float: number;
}
export interface CandyBlob extends CandyType {
  Blob: Array<number>;
}
export interface CandyBytes extends CandyType {
  Bytes: { thawed: Array<number> } | { frozen: Array<number> };
}
export interface CandyOption extends CandyType {
  Option: [] | [CandyType];
}
export interface CandyPrincipal extends CandyType {
  Principal: Principal;
}
export interface CandyArray extends CandyType {
  Array: { thawed: Array<CandyType> } | { frozen: Array<CandyType> };
}

export interface CandyClassEditor {
  addPropertyToCandyClass: (property: Property) => void;
}
