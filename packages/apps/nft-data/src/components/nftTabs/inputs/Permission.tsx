import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';


const Permission = (props : any) => {

    const name = props.item.name;
    const [arrayPrincipals, setArrayPrincipals] = useState([]);

    useEffect(() => {
        if (name==="list") {
            setArrayPrincipals(props.item.list);
        }
    }, [props.item]);

    
  return (
    <TextField id="outlined-basic"  label={"Change "+props.item.name} variant="standard" sx={{marginBottom:1}} />
  )
};

export default Permission;