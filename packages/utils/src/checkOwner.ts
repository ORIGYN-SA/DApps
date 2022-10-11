// 
//
// ----------------------------------------------------------------------------
// Arguments: canister (string) | Link (URL)
// Returns:  string
// Author: Alessandro
// Date: 2022-10-11
// ----------------------------------------------------------------------------

import { Principal } from '@dfinity/principal';
import { getNft, OrigynClient } from '@origyn-sa/mintjs';

export const checkOwner = async (principal: Principal, currCanisterId) => {

    const UserPrincipal  = principal.toText();

    OrigynClient.getInstance().init(currCanisterId);
    const Owner : Principal = await getNft('').then((r) =>
        r.ok.metadata.Class.filter((res) => {
            console.log('response',r);
            return res.name === 'owner';
        })[0].value.Principal.toText(),
    );
        console.log('OWNER',Owner);
        console.log('USERPRINCIPAL',UserPrincipal);

    return (UserPrincipal.toString() === Owner.toString()) ? true : false;
}
