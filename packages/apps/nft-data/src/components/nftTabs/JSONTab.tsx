import React from 'react';
/* import useSite from '../../hooks/useSite'; */

const JSONTab = ({metadata}: any) => {
  console.log(metadata);
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
            {/* <JsonToTable json={metadata} /> */}
            <pre>{JSON.stringify(metadata, null, 2) }</pre>
           {/*  {JSON.stringify(metadata)} */}
        </div>
    )
}

export default JSONTab;
