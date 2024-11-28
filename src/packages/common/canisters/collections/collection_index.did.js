export const idlFactory = ({ IDL }) => {
  const InitArgs = IDL.Record({
    test_mode: IDL.Bool,
    authorized_principals: IDL.Vec(IDL.Principal),
  });
  const Result = IDL.Variant({ Ok: IDL.Bool, Err: IDL.Text });
  const Category = IDL.Record({
    active: IDL.Bool,
    collection_count: IDL.Nat64,
  });
  const Result_1 = IDL.Variant({
    Ok: IDL.Vec(IDL.Tuple(IDL.Text, Category)),
    Err: IDL.Null,
  });
  const Collection = IDL.Record({
    name: IDL.Opt(IDL.Text),
    canister_id: IDL.Principal,
    is_promoted: IDL.Bool,
    category: IDL.Opt(IDL.Text),
  });
  const GetCollectionByPrincipal = IDL.Variant({
    CollectionNotFound: IDL.Null,
  });
  const Result_2 = IDL.Variant({
    Ok: Collection,
    Err: GetCollectionByPrincipal,
  });
  const GetCollectionsArgs = IDL.Record({
    categories: IDL.Opt(IDL.Vec(IDL.Text)),
    offset: IDL.Nat64,
    limit: IDL.Nat64,
  });
  const GetCollectionsResult = IDL.Record({
    total_pages: IDL.Nat64,
    collections: IDL.Vec(Collection),
  });
  const GetCollectionsError = IDL.Variant({ CategoryNotFound: IDL.Text });
  const Result_3 = IDL.Variant({
    Ok: GetCollectionsResult,
    Err: GetCollectionsError,
  });
  const InsertCategoryArgs = IDL.Record({ category_name: IDL.Text });
  const InsertCategoryError = IDL.Variant({
    CategoryAlreadyExists: IDL.Null,
  });
  const Result_4 = IDL.Variant({
    Ok: IDL.Null,
    Err: InsertCategoryError,
  });
  const InsertCollectionArgs = IDL.Record({
    is_promoted: IDL.Bool,
    collection_canister_id: IDL.Principal,
    category: IDL.Text,
  });
  const InsertCollectionError = IDL.Variant({
    GenericOrigynNftError: IDL.Text,
    TargetCanisterIdNotOrigyn: IDL.Null,
    CollectionAlreadyExists: IDL.Null,
    CategoryNotFound: IDL.Text,
  });
  const Result_5 = IDL.Variant({
    Ok: IDL.Null,
    Err: InsertCollectionError,
  });
  const RemoveCategoryError = IDL.Variant({ CategoryNotFound: IDL.Null });
  const Result_6 = IDL.Variant({
    Ok: IDL.Null,
    Err: RemoveCategoryError,
  });
  const RemoveCollectionArgs = IDL.Record({
    collection_canister_id: IDL.Principal,
  });
  const RemoveCollectionError = IDL.Variant({
    CollectionNotFound: IDL.Null,
  });
  const Result_7 = IDL.Variant({
    Ok: IDL.Null,
    Err: RemoveCollectionError,
  });
  const SearchCollectionsArg = IDL.Record({
    categories: IDL.Opt(IDL.Vec(IDL.Text)),
    search_string: IDL.Text,
    offset: IDL.Nat64,
    limit: IDL.Nat64,
  });
  const SetCategoryVisibility = IDL.Record({
    hidden: IDL.Bool,
    category_name: IDL.Text,
  });
  const TogglePromotedArgs = IDL.Record({
    collection_canister_id: IDL.Principal,
  });
  const TogglePromotedError = IDL.Variant({ CollectionNotFound: IDL.Null });
  const Result_8 = IDL.Variant({
    Ok: IDL.Null,
    Err: TogglePromotedError,
  });
  const UpdateCollectionCategoryArgs = IDL.Record({
    collection_canister_id: IDL.Principal,
    category_name: IDL.Text,
  });
  const UpdateCollectionCategoryError = IDL.Variant({
    CollectionNotFound: IDL.Null,
    CategoryNotFound: IDL.Text,
  });
  const Result_9 = IDL.Variant({
    Ok: IDL.Null,
    Err: UpdateCollectionCategoryError,
  });
  return IDL.Service({
    add_authorised_principal: IDL.Func([IDL.Principal], [Result], []),
    get_categories: IDL.Func([], [Result_1], ['query']),
    get_collection_by_principal: IDL.Func([IDL.Principal], [Result_2], ['query']),
    get_collections: IDL.Func([GetCollectionsArgs], [Result_3], ['query']),
    get_user_collections: IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Vec(Collection)], []),
    insert_category: IDL.Func([InsertCategoryArgs], [Result_4], []),
    insert_collection: IDL.Func([InsertCollectionArgs], [Result_5], []),
    remove_category: IDL.Func([InsertCategoryArgs], [Result_6], []),
    remove_collection: IDL.Func([RemoveCollectionArgs], [Result_7], []),
    search_collections: IDL.Func([SearchCollectionsArg], [GetCollectionsResult], ['query']),
    set_category_visibility: IDL.Func([SetCategoryVisibility], [Result_6], []),
    toggle_promoted: IDL.Func([TogglePromotedArgs], [Result_8], []),
    update_collection_category: IDL.Func([UpdateCollectionCategoryArgs], [Result_9], []),
  });
};
export const init = ({ IDL }) => {
  const InitArgs = IDL.Record({
    test_mode: IDL.Bool,
    authorized_principals: IDL.Vec(IDL.Principal),
  });
  return [InitArgs];
};
