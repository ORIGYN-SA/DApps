import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@dapp/features-authentication";
import { Box, IconButton, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import { collectionName } from "@dapp/utils"
//Preloader
import { CircularProgress } from "@mui/material";

export const SearchbarNft = (props) => {
  const { tokenId, actor } = useContext(AuthContext);
  const [selectTokenIds, setSelectTokenIds] = React.useState([""]);
  const [idsNumber, setIdsNumber] = React.useState("");

  const handleSelectIds = (event, value) => {
    //setSearchBarTokenId state
    if (value == null) {
      value = "";
    }
    props.setSearchBarTokenId(value);
    //replace the tokenId in the searchBar
    window.history.pushState(
      "",
      "",
      window.location.href.replace(`/${props.searchBarTokenId}/`, `/${value}/`)
    );
  };

  const getNFTCollection = async () => {
    //console.log("PROVA COLL", tokenId);
    setSelectTokenIds(["Loading..."]);

    let response = await actor?.collection_nft_origyn([]);

    let collectionNFT = response.ok;

    let obj_token_ids = collectionNFT.token_ids;
    let number_ids = collectionNFT.token_ids_count[0].toString();
    setIdsNumber(number_ids);

    var x: string;
    var arrayTokenIds = [];
    for (x in obj_token_ids) {
      var newID = obj_token_ids[x];
      //This is the array created to be filtered with Intersection
      arrayTokenIds.push(newID);
      setSelectTokenIds((x) => {
        return [...newID];
      });
    }

    //Check if the token Id is in the url
    let splitted_url: string[] = window.location.href.split("/");
    //Empty indexID
    props.setIndexID("");
    //Check for indexID in url
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams) {
      if (key == "indexID") {
        props.setIndexID(value);
      }
      break;
    }

    //If an item of splitted array is present in the array of Token Ids
    //we have token id in url
    var intersection = splitted_url.filter(function (e) {
      return arrayTokenIds[0].indexOf(e) > -1;
    });
    if (intersection.length > 0) {
      //setSearchBarTokenId state
      props.setSearchBarTokenId(tokenId);
    } else {
      //setSearchBarTokenId state
      props.setSearchBarTokenId("Not selected");
    }

  };
  //if the actor changes getNftCollection is called
  useEffect(() => {
    if (actor) {
      getNFTCollection();
    }
  }, [actor]);

  return (
    <Box
      component={Paper}
      elevation={2}
      sx={{ margin: 2, width: "100%", padding: 2 }}
    >
      {props.isLoading ? (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress color="inherit"></CircularProgress>
        </Box>
      ) : (
        <FormControl sx={{ m: 1, width: "100%" }}>
          {(tokenId == "") ? (
            <div>
              <Typography
                sx={{
                  m: 1,
                  width: "95%",
                }}
              >Collection name: <b>{collectionName(tokenId)}</b> </Typography>
              <Typography
                sx={{
                  m: 1,
                  borderBottom: "1px solid",
                  paddingBottom: 2,
                  width: "95%",
                }}
              >
                Current Token ID: <b>{props.searchBarTokenId}</b>
              </Typography>
            </div>
          ) : (
            <Typography
              sx={{
                m: 1,
                borderBottom: "1px solid",
                paddingBottom: 2,
                width: "95%",
              }}
            >
              Current Token ID: <b>{props.searchBarTokenId}</b>
            </Typography>
          )}
          <Typography sx={{ m: 1, fontSize: 13 }}>
            Search for other NFT'S <em data-testid="numberIds">(+{idsNumber}...)</em>
          </Typography>
          <Autocomplete
            data-testid="autocomplete"
            disablePortal
            id="combo-box-demo"
            options={selectTokenIds}
            sx={{ width: "95%", m: 1 }}
            renderInput={(params) => (
              <TextField {...params} label="Other tokens IDS" />
            )}
            value={props.searchBarTokenId}
            onChange={(event, newValue) => {
              handleSelectIds(event, newValue);
            }}
          />
        </FormControl>
      )}
    </Box>
  );
};
