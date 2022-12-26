// Get the Owner of the Nft / Library
// Check if the user is the Owner.
// ----------------------------------------------------------------------------
// Arguments: canister (string) | Link (URL)
// Returns:  boolean
// Author: Alessandro
// Date: 2022-10-12
// ----------------------------------------------------------------------------

import { Principal } from '@dfinity/principal';
import { getNftCollectionMeta, OrigynClient } from '@origyn-sa/mintjs';

export const checkOwner = async (principal: Principal, currCanisterId) => {

    OrigynClient.getInstance().init(currCanisterId);

    const UserPrincipal = principal.toText();
    const MetadataCollectionLevelResponse = await getNftCollectionMeta();
    const MetadataCollectionLevel = MetadataCollectionLevelResponse.ok.metadata[0].Class;

    // Collection Owner
    const CollectionData = MetadataCollectionLevel.filter((res) => {
        return res.name === 'owner';
    })[0].value;

    let CollectionOwner: string;

    if ((Object.keys(CollectionData)[0]) == 'Principal') {
        CollectionOwner = CollectionData.Principal.toText();
    } else {
        CollectionOwner = CollectionData.Text;
    }

    // Write Permission List
    const ArrayAllowed = MetadataCollectionLevel.filter((res) => {
            return res.name === '__apps';
        })[0].value.Array.thawed[0].Class[3].value.Class[1].value.Array.thawed;

    // Check if the user is in the write permission list
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

    if ((UserPrincipal === CollectionOwner) || (AllowedUsers() === true)) {
        return true;
    } else {
        return false;
    }

}
