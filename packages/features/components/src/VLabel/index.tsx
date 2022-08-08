import React from "react";

import {Typography} from "@mui/material"


export const VersionLabel = (props) => {

  let VNumber : string = props.ledgerVersion;

  return (
    <Typography variant="button" display="block" gutterBottom sx={{textAlign:'right'}}>LEDGER - {VNumber}</Typography> 
  )
};
