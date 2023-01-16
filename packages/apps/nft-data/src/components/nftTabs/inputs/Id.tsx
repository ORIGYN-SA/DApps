import React, { useContext } from 'react';
import { TextInput } from '@origyn-sa/origyn-art-ui';

// Context
import { MetadataContext } from '../context';

const Id = (props: any) => {

  const { setMetatype } = useContext(MetadataContext);

  const handleChange = (event) => {
    setMetatype(props.item.name,event.target.value);
  };

  return (
    <TextInput
      id="outlined-basic"
      label={'Change ' + props.item.name}
      onChange={handleChange}
    />
  );
};

export default Id;
