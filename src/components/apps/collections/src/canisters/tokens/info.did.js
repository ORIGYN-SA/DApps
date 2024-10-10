export const idlFactory = ({ IDL }) => {
  const GetBlocksResult = IDL.Rec();
  const ICRC3Value = IDL.Rec();
  const Result = IDL.Variant({ Ok: IDL.Nat64, Err: IDL.Text });
  const Result_1 = IDL.Variant({ Ok: IDL.Null, Err: IDL.Text });
  const Result_2 = IDL.Variant({ Ok: IDL.Text, Err: IDL.Text });
  const HttpRequest = IDL.Record({
    url: IDL.Text,
    headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const HttpResponse = IDL.Record({
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    upgrade: IDL.Opt(IDL.Bool),
    status_code: IDL.Nat16,
  });
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Value = IDL.Variant({ Nat: IDL.Nat, Text: IDL.Text });
  const Standard = IDL.Record({ url: IDL.Text, name: IDL.Text });
  const TransferArgs = IDL.Record({
    to: Account,
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat,
  });
  const GenericError = IDL.Record({
    message: IDL.Text,
    error_code: IDL.Nat,
  });
  const BadFee = IDL.Record({ expected_fee: IDL.Nat });
  const CreatedInFuture = IDL.Record({ ledger_time: IDL.Nat64 });
  const InsufficientFunds = IDL.Record({ balance: IDL.Nat });
  const TransferError = IDL.Variant({
    GenericError: GenericError,
    BadFee: BadFee,
    CreatedInFuture: CreatedInFuture,
    TooOld: IDL.Null,
    InsufficientFunds: InsufficientFunds,
  });
  const Result_3 = IDL.Variant({ Ok: IDL.Nat, Err: TransferError });
  const GetArchivesArgs = IDL.Record({ from: IDL.Opt(IDL.Principal) });
  const ICRC3ArchiveInfo = IDL.Record({
    end: IDL.Nat,
    canister_id: IDL.Principal,
    start: IDL.Nat,
  });
  const GetBlocksArgs = IDL.Record({
    start: IDL.Nat64,
    length: IDL.Nat64,
  });
  ICRC3Value.fill(
    IDL.Variant({
      Int: IDL.Int,
      Map: IDL.Vec(IDL.Tuple(IDL.Text, ICRC3Value)),
      Nat: IDL.Nat,
      Blob: IDL.Vec(IDL.Nat8),
      Text: IDL.Text,
      Array: IDL.Vec(ICRC3Value),
    }),
  );
  const BlockWithId = IDL.Record({ id: IDL.Nat, block: ICRC3Value });
  const GetBlocksRequest = IDL.Record({
    start: IDL.Nat,
    length: IDL.Nat,
  });
  const ArchivedBlocks = IDL.Record({
    args: IDL.Vec(GetBlocksRequest),
    callback: IDL.Func([IDL.Vec(GetBlocksRequest)], [GetBlocksResult], ['query']),
  });
  GetBlocksResult.fill(
    IDL.Record({
      log_length: IDL.Nat,
      blocks: IDL.Vec(BlockWithId),
      archived_blocks: IDL.Vec(ArchivedBlocks),
    }),
  );
  const ICRC3DataCertificate = IDL.Record({
    certificate: IDL.Vec(IDL.Nat8),
    hash_tree: IDL.Vec(IDL.Nat8),
  });
  const SupportedBlockType = IDL.Record({
    url: IDL.Text,
    block_type: IDL.Text,
  });
  const Result_4 = IDL.Variant({ Ok: IDL.Nat32, Err: IDL.Text });
  return IDL.Service({
    add_post: IDL.Func(
      [
        IDL.Text,
        IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Nat8))),
        IDL.Opt(IDL.Nat64),
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Vec(IDL.Nat8)),
      ],
      [Result],
      [],
    ),
    add_post_blob: IDL.Func([IDL.Text, IDL.Vec(IDL.Nat8)], [Result_1], []),
    add_post_data: IDL.Func([IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Vec(IDL.Nat8))], [], []),
    backup: IDL.Func([], [], []),
    commit_post: IDL.Func([], [Result], []),
    edit_post: IDL.Func(
      [
        IDL.Nat64,
        IDL.Text,
        IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Nat8))),
        IDL.Text,
        IDL.Opt(IDL.Text),
      ],
      [Result_1],
      [],
    ),
    force_emergency_upgrade: IDL.Func([], [IDL.Bool], []),
    get_neuron_info: IDL.Func([], [Result_2], []),
    http_request: IDL.Func([HttpRequest], [HttpResponse], ['query']),
    http_request_update: IDL.Func([HttpRequest], [HttpResponse], []),
    icrc1_balance_of: IDL.Func([Account], [IDL.Nat], ['query']),
    icrc1_decimals: IDL.Func([], [IDL.Nat8], ['query']),
    icrc1_fee: IDL.Func([], [IDL.Nat], ['query']),
    icrc1_metadata: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, Value))], ['query']),
    icrc1_minting_account: IDL.Func([], [IDL.Opt(Account)], ['query']),
    icrc1_name: IDL.Func([], [IDL.Text], ['query']),
    icrc1_supported_standards: IDL.Func([], [IDL.Vec(Standard)], ['query']),
    icrc1_symbol: IDL.Func([], [IDL.Text], ['query']),
    icrc1_total_supply: IDL.Func([], [IDL.Nat], ['query']),
    icrc1_transfer: IDL.Func([TransferArgs], [Result_3], []),
    icrc3_get_archives: IDL.Func([GetArchivesArgs], [IDL.Vec(ICRC3ArchiveInfo)], ['query']),
    icrc3_get_blocks: IDL.Func([IDL.Vec(GetBlocksArgs)], [GetBlocksResult], ['query']),
    icrc3_get_tip_certificate: IDL.Func([], [IDL.Opt(ICRC3DataCertificate)], ['query']),
    icrc3_supported_block_types: IDL.Func([], [IDL.Vec(SupportedBlockType)], ['query']),
    link_cold_wallet: IDL.Func([IDL.Nat64], [Result_1], []),
    prod_release: IDL.Func([], [IDL.Bool], []),
    propose_release: IDL.Func(
      [IDL.Nat64, IDL.Text, IDL.Vec(IDL.Nat64), IDL.Vec(IDL.Nat8)],
      [Result_4],
      [],
    ),
    set_emergency_release: IDL.Func([IDL.Vec(IDL.Nat8)], [], []),
    stable_mem_read: IDL.Func(
      [IDL.Nat64],
      [IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Vec(IDL.Nat8)))],
      ['query'],
    ),
    unlink_cold_wallet: IDL.Func([], [Result_1], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
