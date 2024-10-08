import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  owner: Principal;
  subaccount: [] | [Uint8Array | number[]];
}
export interface ArchivedBlocks {
  args: Array<GetBlocksRequest>;
  callback: [Principal, string];
}
export interface BadFee {
  expected_fee: bigint;
}
export interface BlockWithId {
  id: bigint;
  block: ICRC3Value;
}
export interface CreatedInFuture {
  ledger_time: bigint;
}
export interface GenericError {
  message: string;
  error_code: bigint;
}
export interface GetArchivesArgs {
  from: [] | [Principal];
}
export interface GetBlocksArgs {
  start: bigint;
  length: bigint;
}
export interface GetBlocksRequest {
  start: bigint;
  length: bigint;
}
export interface GetBlocksResult {
  log_length: bigint;
  blocks: Array<BlockWithId>;
  archived_blocks: Array<ArchivedBlocks>;
}
export interface HttpRequest {
  url: string;
  headers: Array<[string, string]>;
}
export interface HttpResponse {
  body: Uint8Array | number[];
  headers: Array<[string, string]>;
  upgrade: [] | [boolean];
  status_code: number;
}
export interface ICRC3ArchiveInfo {
  end: bigint;
  canister_id: Principal;
  start: bigint;
}
export interface ICRC3DataCertificate {
  certificate: Uint8Array | number[];
  hash_tree: Uint8Array | number[];
}
export type ICRC3Value =
  | { Int: bigint }
  | { Map: Array<[string, ICRC3Value]> }
  | { Nat: bigint }
  | { Blob: Uint8Array | number[] }
  | { Text: string }
  | { Array: Array<ICRC3Value> };
export interface InsufficientFunds {
  balance: bigint;
}
export type Result = { Ok: bigint } | { Err: string };
export type Result_1 = { Ok: null } | { Err: string };
export type Result_2 = { Ok: string } | { Err: string };
export type Result_3 = { Ok: bigint } | { Err: TransferError };
export type Result_4 = { Ok: number } | { Err: string };
export interface Standard {
  url: string;
  name: string;
}
export interface SupportedBlockType {
  url: string;
  block_type: string;
}
export interface TransferArgs {
  to: Account;
  fee: [] | [bigint];
  memo: [] | [Uint8Array | number[]];
  from_subaccount: [] | [Uint8Array | number[]];
  created_at_time: [] | [bigint];
  amount: bigint;
}
export type TransferError =
  | { GenericError: GenericError }
  | { BadFee: BadFee }
  | { CreatedInFuture: CreatedInFuture }
  | { TooOld: null }
  | { InsufficientFunds: InsufficientFunds };
export type Value = { Nat: bigint } | { Text: string };
export interface _SERVICE {
  add_post: ActorMethod<
    [
      string,
      Array<[string, Uint8Array | number[]]>,
      [] | [bigint],
      [] | [string],
      [] | [Uint8Array | number[]],
    ],
    Result
  >;
  add_post_blob: ActorMethod<[string, Uint8Array | number[]], Result_1>;
  add_post_data: ActorMethod<[string, [] | [string], [] | [Uint8Array | number[]]], undefined>;
  backup: ActorMethod<[], undefined>;
  commit_post: ActorMethod<[], Result>;
  edit_post: ActorMethod<
    [bigint, string, Array<[string, Uint8Array | number[]]>, string, [] | [string]],
    Result_1
  >;
  force_emergency_upgrade: ActorMethod<[], boolean>;
  get_neuron_info: ActorMethod<[], Result_2>;
  http_request: ActorMethod<[HttpRequest], HttpResponse>;
  http_request_update: ActorMethod<[HttpRequest], HttpResponse>;
  icrc1_balance_of: ActorMethod<[Account], bigint>;
  icrc1_decimals: ActorMethod<[], number>;
  icrc1_fee: ActorMethod<[], bigint>;
  icrc1_metadata: ActorMethod<[], Array<[string, Value]>>;
  icrc1_minting_account: ActorMethod<[], [] | [Account]>;
  icrc1_name: ActorMethod<[], string>;
  icrc1_supported_standards: ActorMethod<[], Array<Standard>>;
  icrc1_symbol: ActorMethod<[], string>;
  icrc1_total_supply: ActorMethod<[], bigint>;
  icrc1_transfer: ActorMethod<[TransferArgs], Result_3>;
  icrc3_get_archives: ActorMethod<[GetArchivesArgs], Array<ICRC3ArchiveInfo>>;
  icrc3_get_blocks: ActorMethod<[Array<GetBlocksArgs>], GetBlocksResult>;
  icrc3_get_tip_certificate: ActorMethod<[], [] | [ICRC3DataCertificate]>;
  icrc3_supported_block_types: ActorMethod<[], Array<SupportedBlockType>>;
  link_cold_wallet: ActorMethod<[bigint], Result_1>;
  prod_release: ActorMethod<[], boolean>;
  propose_release: ActorMethod<
    [bigint, string, BigUint64Array | bigint[], Uint8Array | number[]],
    Result_4
  >;
  set_emergency_release: ActorMethod<[Uint8Array | number[]], undefined>;
  stable_mem_read: ActorMethod<[bigint], Array<[bigint, Uint8Array | number[]]>>;
  unlink_cold_wallet: ActorMethod<[], Result_1>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
