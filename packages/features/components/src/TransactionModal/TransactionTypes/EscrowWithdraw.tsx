import React from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
//Icons ICP & OGY
import {ICPIcon, OGYIcon} from  "@dapp/common-assets";

const EscrowWithdraw = (props) => {
  //type
  var singleT_type = props.data.type_txn;
  //buyer
  var account_buyer = props.data.buyer;
  var buyer_principal = account_buyer.acc_principal_string;
  //seller
  var account_seller = props.data.seller;
  var seller_principal = account_seller.acc_principal_string;
  //token
  var wit_token = props.data.token;
  //token specs
  var canister = wit_token.canister_string;
  var fee = wit_token.fee;
  var sym = wit_token.symbol;
  var decimals = wit_token.decimal;
  var standard = wit_token.standard;
  //token id
  var token_id = props.data.token_id;
  var amount = props.data.amount;
  var token_fee = props.data.fee;
  if (!token_fee) {
    token_fee = "Undefined";
  }
  //trx_id
  var trans = props.data.trx_id;
  var _nat = trans._nat;
  var _text = trans._text;
  var id_trans : string;
  if (_text) {
    id_trans = _text;
  } else {
    id_trans = _nat.toString();
  }
  return (
    <Box>
      <Box
        sx={{
          padding: 1,
          borderBottom: "1px solid",
        }}
      >
        <Typography
          sx={{ fontSize: 14 }}
          color="text.secondary"
          gutterBottom
        >
          Transaction type:
        </Typography>
        <Typography variant="h5" gutterBottom>
          {singleT_type}
        </Typography>
        <Typography
          sx={{ fontSize: 14 }}
          color="text.secondary"
          gutterBottom
        >
          Transaction ID:
        </Typography>
        <Typography variant="h5" gutterBottom>
          {id_trans}
        </Typography>
      </Box>
      <Box
        sx={{
          padding: 1,
          borderBottom: "1px solid",
        }}
      >
        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Buyer:
            </Typography>
            <Typography gutterBottom>{buyer_principal}</Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Seller:
            </Typography>
            <Typography gutterBottom>{seller_principal}</Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Token ID:
            </Typography>
            <Typography gutterBottom>{token_id}</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Amount:
            </Typography>
            <Typography gutterBottom>{amount}</Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Fee:
            </Typography>
            <Typography gutterBottom>{token_fee}</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ padding: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Canister:
            </Typography>
            <Typography gutterBottom>{canister}</Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Fee:
            </Typography>
            <Typography gutterBottom>{fee}</Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Decimals:
            </Typography>
            <Typography gutterBottom>{decimals}</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Symbol:
            </Typography>
            <Typography>
              {sym === "OGY" ? (
                <OGYIcon className="token-symbol" />
              ) : (
                <ICPIcon className="token-symbol" />
              )}
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Standard:
            </Typography>
            <Typography gutterBottom>{standard}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
};

export default EscrowWithdraw;
