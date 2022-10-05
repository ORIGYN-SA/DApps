import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@dapp/features-authentication";
import NFTInfo from "../NFTInfo";
import { Button, TextField } from "@mui/material";

const Home = () => {
  const { tokenId, canisterId, principal, actor } = useContext(AuthContext);
  const [NFTData, setNFTData] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    const getData = async () => {
      if (actor && canisterId) {
        if (tokenId) {
          try {
            const response = await fetch(
              `https://${canisterId}.raw.ic0.app/-/${tokenId}/info`
            );
            const result = await response.text();
            if (result.search('"is_soulbound":,')) {
              setNFTData(JSON.parse(result.replace('"is_soulbound":,', "")));
            } else {
              setNFTData(JSON.parse(result));
            }
          } catch (err) {
            console.log("err1", err);
          }
        } else {
          try {
            const response = await fetch(
              `https://${canisterId}.raw.ic0.app/collection/info`
            );
            const result = await response.text();
            if (result.search('"is_soulbound":,')) {
              setNFTData(JSON.parse(result.replace('"is_soulbound":,', "")));
            } else {
              setNFTData(JSON.parse(result));
            }
          } catch (err) {
            console.log("err2", err);
          }
        }
      }
    };
    getData();
  }, [actor, canisterId]);

  console.log("this is nftdata", NFTData);

  return (
    <div>
      <div>
        <p>
          Canister ID: <b>{canisterId}</b>
        </p>
        <p>
          Token(NFT) ID: <b>{tokenId}</b>
        </p>
        <div>
          {/* <p>
            <p>
              {" "}
              Write data to NFT:{" "}
              <TextField
                variant="standard"
                type="text"
                onChange={(textData) => setData(textData.target.value)}
              />{" "}
            </p>
          </p>
          <Button variant="contained" onClick={submitData}>
            {" "}
            Add Data{" "}
          </Button> */}
          <br />
          <br />
          <b>NFT Data:</b>
          {NFTData ? <NFTInfo metadata={NFTData} /> : null}
        </div>
      </div>
    </div>
  );
};
export default Home;
