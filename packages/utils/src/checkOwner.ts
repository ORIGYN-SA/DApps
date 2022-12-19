// Get the Owner of the Nft / Library
// Check if the user is the Owner.
// ----------------------------------------------------------------------------
// Arguments: canister (string) | Link (URL)
// Returns:  boolean
// Author: Alessandro
// Date: 2022-10-12
// ----------------------------------------------------------------------------

import { Principal } from '@dfinity/principal';
import { getNft, getNftCollectionMeta, OrigynClient } from '@origyn-sa/mintjs';
export const checkOwner = async (principal: Principal, currCanisterId, currTokenId) => {

    const UserPrincipal = principal.toText();
    OrigynClient.getInstance().init(currCanisterId);

    // COLLECTION OWNER
    const CollectionData = await getNftCollectionMeta().then((r) => r.ok.metadata[0].Class.filter((res) => {
        return res.name === 'owner';
    })[0].value);

    console.log('🚀 - COLLECTION DATA', await getNftCollectionMeta());
    let CollectionOwner: string;

    if ((Object.keys(CollectionData)[0]) == 'Principal') {
        CollectionOwner = CollectionData.Principal.toText();
    } else {
        CollectionOwner = CollectionData.Text;
    }

    // WRITE PERMISSIONS SELECTED NFT
    const ArrayAllowed = await getNft(currTokenId).then((r) =>
        r.ok.metadata.Class.filter((res) => {
            return res.name === '__apps';
        })[0].value.Array.thawed[0].Class[3].value.Class[1].value.Array.thawed);

    // ARRAY OF MANAGERS 
    // if array contains the user principal return true 

    const ArrayManagers = await getNftCollectionMeta().then((r) =>
    r.ok.managers);

    console.log('🚀 - ARRAY MANAGERS', ArrayManagers);

    // CHECK IF THE OWNER IS IN THE PERMISSION LIST
    const AllowedUsers = () => {
        let i: any;
        for (i in ArrayAllowed) {
            let AllowedPrincipals = ArrayAllowed[i].Principal.toText();
            console.log(' 🔏 - PERMISSION LIST - WRITE', AllowedPrincipals);
            if (AllowedPrincipals === UserPrincipal) {
                return true;
            }
        }
    }

    console.log('🚀 - COLLECTION OWNER', CollectionOwner);
    console.log('🚀 - USERPRINCIPAL', UserPrincipal);

    if ((UserPrincipal === CollectionOwner) || (AllowedUsers() === true)) {
        return true;
    } else {
        return false;
    }

}
