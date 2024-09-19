export const idlFactory = ({ IDL }) => {
  const InitArgs = IDL.Record({
    'test_mode' : IDL.Bool,
    'authorized_principals' : IDL.Vec(IDL.Principal),
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const GetCollectionsArgs = IDL.Record({
    'offset' : IDL.Nat64,
    'limit' : IDL.Nat64,
  });
  const Collection = IDL.Record({
    'name' : IDL.Opt(IDL.Text),
    'canister_id' : IDL.Principal,
    'is_promoted' : IDL.Bool,
    'category' : IDL.Opt(IDL.Vec(IDL.Nat64)),
  });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Vec(Collection),
    'Err' : IDL.Text,
  });
  const InsertCollectionArgs = IDL.Record({
    'is_promoted' : IDL.Bool,
    'collection_canister_id' : IDL.Principal,
  });
  const InsertCollectionError = IDL.Variant({
    'GenericOrigynNftError' : IDL.Text,
    'TargetCanisterIdNotOrigyn' : IDL.Null,
    'CollectionAlreadyExists' : IDL.Null,
  });
  const Result_2 = IDL.Variant({
    'Ok' : IDL.Bool,
    'Err' : InsertCollectionError,
  });
  return IDL.Service({
    'add_authorised_principal' : IDL.Func([IDL.Principal], [Result], []),
    'get_collections' : IDL.Func([GetCollectionsArgs], [Result_1], ['query']),
    'insert_collection' : IDL.Func([InsertCollectionArgs], [Result_2], []),
  });
};
export const init = ({ IDL }) => {
  const InitArgs = IDL.Record({
    'test_mode' : IDL.Bool,
    'authorized_principals' : IDL.Vec(IDL.Principal),
  });
  return [InitArgs];
};
