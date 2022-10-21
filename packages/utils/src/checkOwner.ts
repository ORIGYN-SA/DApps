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
            console.log('response', r);
            return res.name === 'owner';
        })[0].value.Principal.toText(),
    );

    // NFT OWNER
    const NftOwner: Principal = await getNft(currTokenId).then((r) =>
        r.ok.metadata.Class.filter((res) => {
            console.log('response NFT', r);
            return res.name === 'owner';
        })[0].value.Principal.toText(),);

    console.log(' LIBRARY OWNER', LibraryOwner);
    console.log('USERPRINCIPAL', UserPrincipal);
    console.log('CURRENT SELECTED NFT : ', currTokenId);
    console.log('NFT OWNER', NftOwner);

    if (UserPrincipal === LibraryOwner.toString()) {
        return true;
    } else {
        return false;
    }
}
