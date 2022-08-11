import React, { Component, useEffect } from 'react';
import { JsonToTable } from "react-json-to-table";

/* import useSite from '../../hooks/useSite'; */

const RawTab = ({metadata}) => {
  
    /* const {getMetadata, metadata} = useSite(); */
    /* useEffect(() => {
        console.log(metadata);
       }, [metadata]); */
      /* useEffect(() => {
        
        getMetadata();
        console.log(metadata);
      }, []); */
    return (
        <div>
{/*             <JSONViewer json={[metadata]}/> */}
            {/* {metadata} */}
            <JsonToTable json={metadata} />
            {/* <pre>{JSON.stringify(metadata, null, 2) }</pre> */}
           {/*  {JSON.stringify(metadata)} */}
        </div>
    )
}

export default RawTab;
