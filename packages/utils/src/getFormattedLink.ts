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

    const QueryName: any = await phonebookActor?.reverse_lookup(Principal.fromText(currCanisterId));
    const HasRoot = linkToFormat.includes(currCanisterId || QueryName);

    let formattedLink: string = '';
    try {
        if (await QueryName == "" || await QueryName == null) {
            formattedLink = (HasRoot) ?
                (linkToFormat) : ('https://' + currCanisterId + '.raw.ic0.app/' + linkToFormat.replace(currCanisterId, currCanisterId));
                return formattedLink;
        } else {
            if(HasRoot) {
                let NewLink = new URL(linkToFormat);
                let HostString = NewLink.hostname;
                let PrptlLink = linkToFormat.replace(HostString, 'prptl.io/-/' + QueryName);
                formattedLink = PrptlLink;
                return formattedLink;
            }else{
                formattedLink = 'https://' + currCanisterId + '.raw.ic0.app/' + linkToFormat.replace(currCanisterId, QueryName);
                return formattedLink;
            }
        }
    } catch (e) {
        console.log('Error during formatting link ' + e);
    }
};
