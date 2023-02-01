import { CandyFloat } from '../../../types';

export function convertToCandyFloat(typedValue: string): CandyFloat | undefined {
    if (/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(typedValue)) {
        const num = Number(typedValue);
        return { Float: num };
    }
    return undefined;
}
