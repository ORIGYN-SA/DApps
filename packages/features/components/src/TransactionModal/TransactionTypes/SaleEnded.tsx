import React from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
//Icons ICP & OGY
import {ICPIcon, OGYIcon} from  "@dapp/common-assets";

const SaleEnded = (props) => {
  var end_seller = props.data.seller;
  var principal_seller = end_seller.acc_principal_string;

  var end_buyer = props.data.buyer;
  var principal_buyer = end_buyer.acc_principal_string;

  var end_amount = props.data.amount;

  var token_end = props.data.token;
  var canister = token_end.canister_string;
  var fee = token_end.fee;
  var sym = token_end.symbol;
  var decimals = token_end.decimal;
  var standard = token_end.standard;


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
          {props.data.type_txn}
        </Typography>
        <Typography
          sx={{ fontSize: 14 }}
          color="text.secondary"
          gutterBottom
        >
          Sale ID:
        </Typography>
        <Typography variant="h5" gutterBottom>
          {props.data.sale}
        </Typography>
      </Box>
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
          Amount:
        </Typography>
        <Typography gutterBottom>{end_amount}</Typography>
        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Buyer:
            </Typography>
            <Typography gutterBottom>{principal_buyer}</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Seller:
            </Typography>
            <Typography gutterBottom>{principal_seller}</Typography>
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
  );
};

export default SaleEnded;
