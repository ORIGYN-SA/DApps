export default ({ IDL }) => {
  const Name = IDL.Text;
  const Canister = IDL.Principal;
  const Canisters = IDL.Vec(Canister);
  return IDL.Service({
    'delete' : IDL.Func([Name], [IDL.Opt(Canisters)], []),
    'insert' : IDL.Func([Name, Canisters], [IDL.Opt(Canisters)], []),
    'lookup' : IDL.Func([Name], [IDL.Opt(IDL.Vec(Canister))], ['query']),
    'update_admin' : IDL.Func([Canisters], [Canisters], []),
  });
}; 
export const init = ({ IDL }) => { return []; }; 