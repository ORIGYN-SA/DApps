import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category {
  active: boolean;
  collection_count: bigint;
}
export interface Collection {
  name: [] | [string];
  canister_id: Principal;
  is_promoted: boolean;
  category: [] | [string];
}
export type GetCollectionByPrincipal = { CollectionNotFound: null };
export interface GetCollectionsArgs {
  categories: [] | [Array<string>];
  offset: bigint;
  limit: bigint;
}
export type GetCollectionsError = { CategoryNotFound: string };
export interface GetCollectionsResult {
  total_pages: bigint;
  collections: Array<Collection>;
}
export interface InitArgs {
  test_mode: boolean;
  authorized_principals: Array<Principal>;
}
export interface InsertCategoryArgs {
  category_name: string;
}
export type InsertCategoryError = { CategoryAlreadyExists: null };
export interface InsertCollectionArgs {
  is_promoted: boolean;
  collection_canister_id: Principal;
  category: string;
}
export type InsertCollectionError =
  | { GenericOrigynNftError: string }
  | { TargetCanisterIdNotOrigyn: null }
  | { CollectionAlreadyExists: null }
  | { CategoryNotFound: string };
export type RemoveCategoryError = { CategoryNotFound: null };
export interface RemoveCollectionArgs {
  collection_canister_id: Principal;
}
export type RemoveCollectionError = { CollectionNotFound: null };
export type Result = { Ok: boolean } | { Err: string };
export type Result_1 = { Ok: Array<[string, Category]> } | { Err: null };
export type Result_2 = { Ok: Collection } | { Err: GetCollectionByPrincipal };
export type Result_3 = { Ok: GetCollectionsResult } | { Err: GetCollectionsError };
export type Result_4 = { Ok: null } | { Err: InsertCategoryError };
export type Result_5 = { Ok: null } | { Err: InsertCollectionError };
export type Result_6 = { Ok: null } | { Err: RemoveCategoryError };
export type Result_7 = { Ok: null } | { Err: RemoveCollectionError };
export type Result_8 = { Ok: null } | { Err: TogglePromotedError };
export type Result_9 = { Ok: null } | { Err: UpdateCollectionCategoryError };
export interface SearchCollectionsArg {
  categories: [] | [Array<string>];
  search_string: string;
  offset: bigint;
  limit: bigint;
}
export interface SetCategoryVisibility {
  hidden: boolean;
  category_name: string;
}
export interface TogglePromotedArgs {
  collection_canister_id: Principal;
}
export type TogglePromotedError = { CollectionNotFound: null };
export interface UpdateCollectionCategoryArgs {
  collection_canister_id: Principal;
  category_name: string;
}
export type UpdateCollectionCategoryError =
  | { CollectionNotFound: null }
  | { CategoryNotFound: string };
export interface _SERVICE {
  add_authorised_principal: ActorMethod<[Principal], Result>;
  get_categories: ActorMethod<[], Result_1>;
  get_collection_by_principal: ActorMethod<[Principal], Result_2>;
  get_collections: ActorMethod<[GetCollectionsArgs], Result_3>;
  get_user_collections: ActorMethod<[[] | [Principal]], Array<Collection>>;
  insert_category: ActorMethod<[InsertCategoryArgs], Result_4>;
  insert_collection: ActorMethod<[InsertCollectionArgs], Result_5>;
  remove_category: ActorMethod<[InsertCategoryArgs], Result_6>;
  remove_collection: ActorMethod<[RemoveCollectionArgs], Result_7>;
  search_collections: ActorMethod<[SearchCollectionsArg], GetCollectionsResult>;
  set_category_visibility: ActorMethod<[SetCategoryVisibility], Result_6>;
  toggle_promoted: ActorMethod<[TogglePromotedArgs], Result_8>;
  update_collection_category: ActorMethod<[UpdateCollectionCategoryArgs], Result_9>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
