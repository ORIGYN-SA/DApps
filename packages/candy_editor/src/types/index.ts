import type { Principal } from '@dfinity/principal';

export interface CandyType { }

export interface Property {
  value: CandyType;
  name: string;
  immutable: boolean;
}

export interface PropertyWithType extends Property {
  type: string;
}

export interface CandyIntegers extends CandyType { }

export interface CandyNaturals extends CandyType { }

export interface CandyEmpty extends CandyType {
  Empty: null;
}
export interface CandyClass extends CandyType {
  Class: Array<Property>;
}
export interface CandyText extends CandyType {
  Text: string;
}
export interface CandyNat extends CandyNaturals {
  Nat: bigint;
}
export interface CandyBool extends CandyNaturals {
  Bool: boolean;
}
export interface CandyNat8 extends CandyNaturals {
  Nat8: number;
}
export interface CandyNat16 extends CandyNaturals {
  Nat16: number;
}
export interface CandyNat32 extends CandyNaturals {
  Nat32: number;
}
export interface CandyNat64 extends CandyNaturals {
  Nat64: bigint;
}
export interface CandyNats extends CandyType {
  Nats: { thawed: Array<bigint> } | { frozen: Array<bigint> };
}
export interface CandyInt extends CandyIntegers {
  Int: bigint;
}
export interface CandyInt8 extends CandyIntegers {
  Int8: number;
}
export interface CandyInt16 extends CandyIntegers {
  Int16: number;
}
export interface CandyInt32 extends CandyIntegers {
  Int32: number;
}
export interface CandyInt64 extends CandyIntegers {
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

export type EditorMode = "create" | "edit" | null;

export interface CandyClassEditor {
  addPropertyToCandyClass?: (property: Property) => void;
  candyType?: CandyType;
  editExistingProperty?: (updatedProperty: Property) => void;
  property?: Property;
  removePropertyFromCandyClass?: (property: Property) => void;
  editorMode: EditorMode;
}
