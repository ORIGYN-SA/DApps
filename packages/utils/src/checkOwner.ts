// Get the Owner of the Nft / Library
// Check if the user is the Owner.
// ----------------------------------------------------------------------------
// Arguments: canister (string) | Link (URL)
// Returns:  boolean
// Author: Alessandro
// Date: 2022-10-12
// ----------------------------------------------------------------------------

import { Principal } from '@dfinity/principal';
import { getNft, OrigynClient } from '@origyn-sa/mintjs';

export const checkOwner = async (principal: Principal, currCanisterId, currTokenId) => {

    const UserPrincipal = principal.toText();

    OrigynClient.getInstance().init(currCanisterId);


    // DEFAULT LIBRARIES OWNER
    const LibraryOwner: Principal = await getNft('').then((r) =>
        r.ok.metadata.Class.filter((res) => {
            return res.name === 'owner';
        })[0].value.Principal.toText(),
    );

    // NFT OWNER
    const NftOwner: Principal = await getNft(currTokenId).then((r) =>
        r.ok.metadata.Class.filter((res) => {
            return res.name === 'owner';
        })[0].value.Principal.toText(),);

    // WRITE PERMISSIONS
    const ArrayAllowed  = await getNft(currTokenId).then((r) =>
    r.ok.metadata.Class.filter((res) => {
        return res.name === '__apps';
    })[0].value.Array.thawed[0].Class[3].value.Class[1].value.Array.thawed);
    let i : any; 
    const AllowedUsers = () => {
    for(i in ArrayAllowed){
        let AllowedPrincipal = ArrayAllowed[i].Principal.toText();
        console.log(' 🔏 - PERMISSION LIST - WRITE', AllowedPrincipal);
        if(AllowedPrincipal === UserPrincipal){
            return true;
        }
    }
    }


    console.log('🚀 - COLLECTION OWNER', LibraryOwner); 
    console.log('🚀 - USERPRINCIPAL', UserPrincipal);
    console.log('🚀 - CURRENT SELECTED NFT : ', currTokenId);
    console.log('🚀 - NFT OWNER', NftOwner);

    if ((UserPrincipal === LibraryOwner.toString()) || (AllowedUsers() === true)) {
        return true;
    } else {
        return false;
    }

}
