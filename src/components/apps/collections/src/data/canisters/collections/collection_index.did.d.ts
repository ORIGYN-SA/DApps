import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Collection {
  'name' : [] | [string],
  'canister_id' : Principal,
  'is_promoted' : boolean,
  'category' : [] | [BigUint64Array | bigint[]],
}
export interface GetCollectionsArgs { 'offset' : bigint, 'limit' : bigint }
export interface InitArgs {
  'test_mode' : boolean,
  'authorized_principals' : Array<Principal>,
}
export interface InsertCollectionArgs {
  'is_promoted' : boolean,
  'collection_canister_id' : Principal,
}
export type InsertCollectionError = { 'GenericOrigynNftError' : string } |
  { 'TargetCanisterIdNotOrigyn' : null } |
  { 'CollectionAlreadyExists' : null };
export type Result = { 'Ok' : boolean } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : Array<Collection> } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : boolean } |
  { 'Err' : InsertCollectionError };
export interface _SERVICE {
  'add_authorised_principal' : ActorMethod<[Principal], Result>,
  'get_collections' : ActorMethod<[GetCollectionsArgs], Result_1>,
  'insert_collection' : ActorMethod<[InsertCollectionArgs], Result_2>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
