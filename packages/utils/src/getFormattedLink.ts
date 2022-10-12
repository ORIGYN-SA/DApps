// This function replace the CanisterId with the name of the canister
// if the canister name is not defined nothing will be replaced
// ----------------------------------------------------------------------------
// Arguments: canister (string) | Link (URL)
// Returns:  string
// Author: Alessandro
// Date: 2022-10-11
// ----------------------------------------------------------------------------

import { phonebookIdl } from '@dapp/common-candid';
import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent } from '@dfinity/agent';

 // Phonebook Agent
 const agent = new HttpAgent({
    host: 'https://boundary.ic0.app/',
});
// Phonebook actor for the current canister name 
const phonebookActor = Actor.createActor(phonebookIdl, {
    agent: agent,
    canisterId: 'ngrpb-5qaaa-aaaaj-adz7a-cai',
});

export const GetFormattedLink = async (currCanisterId, linkToFormat) => {

    const QueryName: any = await phonebookActor?.reverse_lookup(
        Principal.fromText(currCanisterId));

    let formattedLink: string = '';
try{
    if (QueryName == "" || QueryName == null) {
        formattedLink = linkToFormat.replace(currCanisterId, currCanisterId);
    } else {
        formattedLink = linkToFormat.replace(currCanisterId, QueryName);
    }

    return formattedLink;
} catch (e) {
    console.log('Error during formatting link ' + e);
}
};
