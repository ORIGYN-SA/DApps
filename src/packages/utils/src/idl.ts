import { IDL } from '@dfinity/candid';
import { xtcIdl, extIdl, dip20Idl, wicpIdl, icpIdl } from '@dapp/common-candid';

export enum IdlStandard {
  XTC,
  EXT,
  DIP20,
  WICP,
  ICP,
}

export const getIdl = (
  standard: IdlStandard,
): IDL.InterfaceFactory => {
  const idl = {
    [IdlStandard.XTC]: xtcIdl,
    [IdlStandard.EXT]: extIdl,
    [IdlStandard.DIP20]: dip20Idl,
    [IdlStandard.WICP]: wicpIdl,
    [IdlStandard.ICP]: icpIdl,
  }[standard];
  return idl;
};
