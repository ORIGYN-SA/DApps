import { CandyPrincipal } from '@dapp/common-types';
import { Principal } from '@dfinity/principal';

export function convertToCandyPrincipal(typedValue: string): CandyPrincipal | undefined {
    try {
        const principal = Principal.fromText(typedValue.trim());
        return { Principal: principal };
    } catch (e) {
        return undefined;
    }
}