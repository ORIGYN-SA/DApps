import React from 'react';
import { TextInput } from '@origyn/origyn-art-ui';

const Permission = (props: any) => {
  // const name = props.item.name;
  // const [arrayPrincipals, setArrayPrincipals] = useState([]);

  // useEffect(() => {
  //   if (name === 'list') {
  //     setArrayPrincipals(props.item.list);
  //   }
  // }, [props.item]);

  return <TextInput id="outlined-basic" label={'Change ' + props.item.name} />;
};

export default Permission;
