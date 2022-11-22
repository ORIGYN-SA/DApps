// ----------------------------------------------------------------------------
// This function Formats the links from canisters to be displayed in the UI
// • currentCanisterId: The canisterId of the current canister
// • linkToFormat: The link to be formatted
// ----------------------------------------------------------------------------
// Returns:  string
// Author: Alessandro
// Date: 2022-11-17
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

export const GetFormattedLink = async (currCanisterId : string, linkToFormat : string) => {

    const QueryName: any = (await phonebookActor)?.reverse_lookup(Principal.fromText(currCanisterId));
    const HasRoot = linkToFormat.includes(currCanisterId || QueryName);
    let formattedLink: string = '';
    try {
        const isValidUrl = new URL(linkToFormat);
        if (isValidUrl) {
            formattedLink = linkToFormat;
        }
        return formattedLink;
    } catch (err) {
        if (QueryName) {
            formattedLink = (HasRoot) ?
                (linkToFormat) : ('https://' + currCanisterId + '.raw.ic0.app/' + linkToFormat);
            return formattedLink;
        } else {
            if (HasRoot) {
                let NewLink = new URL(linkToFormat);
                let HostString = NewLink.hostname;
                let PrptlLink = linkToFormat.replace(HostString, 'prptl.io/-/' + QueryName);
                formattedLink = PrptlLink;
                return formattedLink;
            } else {
                formattedLink = 'https://prptl.io/-/' + QueryName + '/-/' + linkToFormat;
                return formattedLink;
            }
        }
    }
};
