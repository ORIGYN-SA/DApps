import { CandyFloat } from '../../../types';

export function isInRange(
    num: number | bigint,
    min: number | bigint,
    max: number | bigint,
): boolean {
    return num >= min && num <= max;
}

export function convertToCandyFloat(typedValue: string): CandyFloat | undefined {
    if (
        /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(typedValue) &&
        isInRange(Number(typedValue), -3.4028234663852886e38, 3.4028234663852886e38)
    ) {
        const num = Number(typedValue);
        return { Float: num };
    }
    return undefined;
}
