import React from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
//Icons ICP & OGY
import {ICPIcon, OGYIcon} from  "@dapp/common-assets";

const Mint = (props) => {
    var singleT_type = props.data.type_txn;
    var singleT_mint_from = props.data.mint_from;
    var singleT_mint_to = props.data.mint_to;
    //enter in sale
    var singleT_sale = props.data.sale;
    //inspect sale amount
    var amount_mint = singleT_sale.amount;
    //inspect token
    var token_mint = singleT_sale.token;

    var display_token_config: JSX.Element;

    if (token_mint == "Token not defined") {
        display_token_config = (
            <Box
                sx={{
                    padding: 1,
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                        <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                        >
                            Token:
                        </Typography>
                        <Typography sx={{ fontSize: 12 }} gutterBottom>
                            {token_mint}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                        >
                            Amount:
                        </Typography>
                        <Typography sx={{ fontSize: 12 }} gutterBottom>
                            {amount_mint}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        );
    } else {
        var canister = token_mint.canister_string;
        var fee = token_mint.fee;
        var sym = token_mint.symbol;
        var decimals = token_mint.decimal;
        var standard = token_mint.standard;
        display_token_config = (
            <Box
                sx={{
                    padding: 1,
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                        <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                        >
                            Canister:
                        </Typography>
                        <Typography sx={{ fontSize: 12 }} gutterBottom>
                            {canister}
                        </Typography>
                        <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                        >
                            Fee:
                        </Typography>
                        <Typography sx={{ fontSize: 12 }} gutterBottom>
                            {fee}
                        </Typography>
                        <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                        >
                            Decimals:
                        </Typography>
                        <Typography sx={{ fontSize: 12 }} gutterBottom>
                            {decimals}
                        </Typography>
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
                        <Typography sx={{ fontSize: 12 }} gutterBottom>
                            {standard}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        );
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
                <Grid container>
                    <Grid item xs={6} md={6}>
                        <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                        >
                            Mint from:
                        </Typography>
                        <Typography gutterBottom>{singleT_mint_from}</Typography>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                        >
                            Mint to:
                        </Typography>
                        <Typography gutterBottom>{singleT_mint_to}</Typography>
                    </Grid>
                </Grid>
            </Box>
            <div children={display_token_config}></div>
        </Box>
    )
};

export default Mint;
