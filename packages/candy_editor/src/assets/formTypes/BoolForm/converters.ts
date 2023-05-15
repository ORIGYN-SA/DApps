import { CandyBool } from '@dapp/common-types';

export function convertToCandyBool(selectedValue: string): CandyBool | undefined {
    let booleanValue: boolean;
    if (selectedValue.toLowerCase() === 'true') {
        booleanValue = true;
    } else if (selectedValue.toLowerCase() === 'false') {
        booleanValue = false;
    } else {
        return undefined;
    }
    return { Bool: booleanValue };
}
