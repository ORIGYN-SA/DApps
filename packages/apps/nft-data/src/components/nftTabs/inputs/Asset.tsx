import React, { useEffect, useState, useContext, createContext } from 'react';
import { getNft, getNftCollectionMeta, OrigynClient } from '@origyn-sa/mintjs';
import { getTokenId, getCanisterId } from '@dapp/features-authentication';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Grid, TextField, Button, Box, Divider, Select, SelectChangeEvent, FormControl } from '@mui/material';
// Context
import { MetadataContext } from '../context';
const Asset = (props: any) => {

  const [librariesFromMeta, setLibrariesFromMeta] = useState([]);
  // use the context
  const { setMetatype } = useContext(MetadataContext);

  const getLibrariesFromMeta = async () => {
    await OrigynClient.getInstance().init(true, await getCanisterId());
    let getMeta = [];
    if (getTokenId()) {
      const response = await getNft(getTokenId());
      getMeta = response.ok.metadata.Class;
    } else {
      const response = await getNftCollectionMeta();
      getMeta = response.ok.metadata[0].Class;
    }
    let arrayIDS = [];
    const libraries = getMeta.filter((res) => {
      return res.name === 'library';
    })[0].value.Array.thawed;

    libraries.forEach((library: any) => {
      arrayIDS.push(library.Class[0].value.Text);
    });
    setLibrariesFromMeta(arrayIDS);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setMetatype(props.item.name, event.target.value);
  };

  useEffect(() => {
    getLibrariesFromMeta();
  }, []);

  return (
    <>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="select-asset">Change {props.item.name} Asset</InputLabel>
        <Select
          labelId={'Change ' + props.item.name + ' Asset'}
          id="select-asset"
          label="Change Asset"
          value={props.item.value}
          onChange={handleChange}
        >
          {librariesFromMeta.map((library, index) => {
            return (
              <MenuItem key={library + index} value={library}>
                {library}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
};

export default Asset;
