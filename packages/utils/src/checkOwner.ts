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

    let CollectionOwner: string;
    if ((Object.keys(CollectionData)[0]) == 'Principal') {
        CollectionOwner = CollectionData.Principal.toText();
    } else {
        CollectionOwner = CollectionData.Text;
    }

    // SELECTED NFT OWNER
    const NftOwner = await getNft(currTokenId).then((r) =>
        r.ok.metadata.Class.filter((res) => {
            return res.name === 'owner';
        })[0].value.Principal.toText(),);

    // WRITE PERMISSIONS SELECTED NFT
    const ArrayAllowed = await getNft(currTokenId).then((r) =>
        r.ok.metadata.Class.filter((res) => {
            return res.name === '__apps';
        })[0].value.Array.thawed[0].Class[3].value.Class[1].value.Array.thawed);

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
    console.log('🚀 - CURRENT SELECTED NFT : ', await currTokenId);
    console.log('🚀 - NFT OWNER', NftOwner);

    if ((UserPrincipal === CollectionOwner) || (AllowedUsers() === true)) {
        return true;
    } else {
        return false;
    }

}
