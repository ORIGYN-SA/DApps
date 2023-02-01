import { CandyPrincipal } from '../../../types';
import { Principal } from '@dfinity/principal';

export function convertToCandyPrincipal(typedValue: string): CandyPrincipal | undefined {
    try {
        const principal = Principal.fromText(typedValue);
        return { Principal: principal };
    } catch (e) {
        return undefined;
    }
}