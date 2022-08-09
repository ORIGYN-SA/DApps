import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from "./auth"

const { tokenId, actor } = useContext(AuthContext);

export const getLibraries = () => {

    const [ libData, setLibData ] = useState();
        
        useEffect(() => { actor?.nft_origyn(tokenId).then((r) => 
            {setLibData(r.ok.metadata.Class.
            filter(res => { return res['name'] === 'library'})[0].value.Array.thawed)})}, [actor]) 

        console.log("This is libData ", libData)

        return libData;
        
    }


