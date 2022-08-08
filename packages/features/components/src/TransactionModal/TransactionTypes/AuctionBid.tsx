import React from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
//Icons ICP & OGY
import {ICPIcon, OGYIcon} from  "@dapp/common-assets";


const AuctionBid = (props) => {
  var singleT_type = props.data.type_txn;
  var bid_buyer = props.data.buyer;
  //buyer accoount
  var buyer = bid_buyer.acc_principal_string;
  //I HAVE OTHER BUYER PROPS IN ACCOUNT BUT NOT WORKING?
  var bid_amount = props.data.amount;
  var bid_token = props.data.token;
  //token specs
  var canister = bid_token.canister_string;
  var fee = bid_token.fee;
  var sym = bid_token.symbol;
  var decimals = bid_token.decimal;
  var standard = bid_token.standard;
  var bid_saleId = props.data.sale_id;

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
          Sale ID:
        </Typography>
        <Typography variant="h5" gutterBottom>
          {bid_saleId}
        </Typography>
        <Grid container>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Buyer:
            </Typography>
            <Typography gutterBottom>{buyer}</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Amount:
            </Typography>
            <Typography gutterBottom>{bid_amount}</Typography>
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

export default AuctionBid;
