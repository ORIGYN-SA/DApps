import React from "react";
import { natToFloat } from "../../utils/number";
import ICPIcon from "../../assets/icp.svg";
import OGYIcon from "../../assets/ogy.svg";

export const NatPrice = ({ value, symbol }: NatPrice) => {
  if (!symbol) return <>{natToFloat(value)}</>;
  return (
    <>
      {symbol === "OGY" ? (
        <OGYIcon className="token-symbol" />
      ) : (
        <ICPIcon className="token-symbol" />
      )}
      {natToFloat(value)}
    </>
  );
};
export type NatPrice = {
  value: any;
  symbol?: string;
};
