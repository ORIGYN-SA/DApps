import React, { useEffect, useContext } from 'react';
import { TextInput } from '@origyn-sa/origyn-art-ui';

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
    <TextInput
      id="outlined-basic"
      label={'Change ' + props.item.name}
      onChange={handleChange}
    />
  );
};

export default App;
