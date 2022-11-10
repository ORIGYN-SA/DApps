import React, { useContext } from 'react';
import { TextField } from '@mui/material';

// Context
import { MetadataContext } from '../context';

const Id = (props: any) => {

  const { setMetatype } = useContext(MetadataContext);

  const handleChange = (event) => {
    setMetatype(props.item.name,event.target.value);
  };

  return (
    <TextField
      id="outlined-basic"
      label={'Change ' + props.item.name}
      variant="standard"
      sx={{ marginBottom: 1 }}
      onChange={handleChange}
    />
  );
};

export default Id;
