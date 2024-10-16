import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category {
  'active' : boolean,
  'name' : string,
  'collection_count' : bigint,
}
export interface Collection {
  'name' : [] | [string],
  'canister_id' : Principal,
  'is_promoted' : boolean,
  'category' : [] | [bigint],
}
export type GetCollectionByPrincipal = { 'CollectionNotFound' : null };
export interface GetCollectionsArgs {
  'categories' : [] | [BigUint64Array | bigint[]],
  'offset' : bigint,
  'limit' : bigint,
}
export type GetCollectionsError = { 'CategoryNotFound' : string };
export interface GetCollectionsResult {
  'total_pages' : bigint,
  'collections' : Array<Collection>,
}
export interface InitArgs {
  'test_mode' : boolean,
  'authorized_principals' : Array<Principal>,
}
export interface InsertCategoryArgs { 'category_name' : string }
export type InsertCategoryError = { 'CategoryAlreadyExists' : null };
export interface InsertCollectionArgs {
  'is_promoted' : boolean,
  'collection_canister_id' : Principal,
  'category' : bigint,
}
export type InsertCollectionError = { 'GenericOrigynNftError' : string } |
  { 'TargetCanisterIdNotOrigyn' : null } |
  { 'CollectionAlreadyExists' : null } |
  { 'CategoryNotFound' : string };
export interface RemoveCollectionArgs { 'collection_canister_id' : Principal }
export type RemoveCollectionError = { 'CollectionNotFound' : null };
export type Result = { 'Ok' : boolean } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : Array<[bigint, Category]> } |
  { 'Err' : null };
export type Result_2 = { 'Ok' : Collection } |
  { 'Err' : GetCollectionByPrincipal };
export type Result_3 = { 'Ok' : GetCollectionsResult } |
  { 'Err' : GetCollectionsError };
export type Result_4 = { 'Ok' : null } |
  { 'Err' : InsertCategoryError };
export type Result_5 = { 'Ok' : null } |
  { 'Err' : InsertCollectionError };
export type Result_6 = { 'Ok' : null } |
  { 'Err' : RemoveCollectionError };
export type Result_7 = { 'Ok' : null } |
  { 'Err' : SetCategoryVisibilityError };
export type Result_8 = { 'Ok' : null } |
  { 'Err' : UpdateCollectionCategoryError };
export interface SearchCollectionsArg {
  'categories' : [] | [BigUint64Array | bigint[]],
  'search_string' : string,
  'offset' : bigint,
  'limit' : bigint,
}
export interface SetCategoryVisibility {
  'hidden' : boolean,
  'category_id' : bigint,
}
export type SetCategoryVisibilityError = { 'CategoryNotFound' : null };
export interface UpdateCollectionCategoryArgs {
  'collection_canister_id' : Principal,
  'category_id' : bigint,
}
export type UpdateCollectionCategoryError = { 'CollectionNotFound' : null } |
  { 'CategoryNotFound' : string };
export interface _SERVICE {
  'add_authorised_principal' : ActorMethod<[Principal], Result>,
  'get_categories' : ActorMethod<[], Result_1>,
  'get_collection_by_principal' : ActorMethod<[Principal], Result_2>,
  'get_collections' : ActorMethod<[GetCollectionsArgs], Result_3>,
  'get_user_collections' : ActorMethod<[[] | [Principal]], Array<Collection>>,
  'insert_category' : ActorMethod<[InsertCategoryArgs], Result_4>,
  'insert_collection' : ActorMethod<[InsertCollectionArgs], Result_5>,
  'remove_collection' : ActorMethod<[RemoveCollectionArgs], Result_6>,
  'search_collections' : ActorMethod<
    [SearchCollectionsArg],
    GetCollectionsResult
  >,
  'set_category_visibility' : ActorMethod<[SetCategoryVisibility], Result_7>,
  'update_collection_category' : ActorMethod<
    [UpdateCollectionCategoryArgs],
    Result_8
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
