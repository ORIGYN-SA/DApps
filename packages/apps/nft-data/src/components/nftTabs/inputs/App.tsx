import React, { useEffect, useContext } from 'react';
import { TextField } from '@mui/material';

// Context
import { MetadataContext } from '../context';

const App = (props: any) => {

  const { setMetatype,app_id } = useContext(MetadataContext);

  const handleChange = (event) => {
    setMetatype(props.item.name,event.target.value);
  };

  useEffect(() => {
    setMetatype(props.item.name,props.item.value);

  }, []);

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

export default App;
