// Check if the user is the owner of the collection or if he is in the write permission list/manager list
// ----------------------------------------------------------------------------
// Arguments: canister (string) | Link (URL)
// Returns:  boolean
// Author: Alessandro
// Date: 2022-10-12
// ----------------------------------------------------------------------------

import { Principal } from '@dfinity/principal';
import { getNftCollectionMeta, OrigynClient } from '@origyn/mintjs';

export const checkOwner = async (principal: Principal, currCanisterId: string) => {
  OrigynClient.getInstance().init(true, currCanisterId);

  const userPrincipal = principal.toText();
  const metadataCollectionLevelResponse = await getNftCollectionMeta();
  const metadataCollectionLevel = metadataCollectionLevelResponse.ok?.metadata?.[0]?.Class;

  // Collection Owner
  const collectionData = metadataCollectionLevel.filter((res) => {
    return res.name === 'owner';
  })[0].value;

  let collectionOwner: string;

  if (Object.keys(collectionData)[0] == 'Principal') {
    collectionOwner = collectionData.Principal.toText();
  } else {
    collectionOwner = collectionData.Text;
  }
  console.log('🚀 - COLLECTION OWNER', collectionOwner);

  // Write Permission List
  const arrayAllowed = metadataCollectionLevel.filter((res) => {
    return res.name === '__apps';
  })[0].value.Array.thawed[0].Class[3].value.Class[1].value.Array.thawed;

  const isAllowed = () => {
    let i: any;
    for (i in arrayAllowed) {
      let AllowedPrincipals = arrayAllowed[i].Principal.toText();
      console.log(' 🔏 - PERMISSION LIST - WRITE', AllowedPrincipals);
      if (AllowedPrincipals === userPrincipal) {
        return true;
      }
    }
  };

  const managers = metadataCollectionLevelResponse.ok?.managers[0] || [];
  console.log('Managers list: ', managers);
  const isManager = () => {
    let i: any;
    for (i in managers) {
      let managersPrincipals = managers[i];
      console.log(' 🔏 - MANAGER' + ' #' + i + ' ' + managersPrincipals.toString());
      if (managersPrincipals.toString() === userPrincipal) {
        return true;
      }
    }
  };

  return isManager() || isAllowed() || userPrincipal === collectionOwner;
};
