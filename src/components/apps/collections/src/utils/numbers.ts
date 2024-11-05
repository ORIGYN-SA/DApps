export const divideBy1e8 = (number: number | bigint | string): number => {
  return typeof number === 'bigint' ? Number(number) / 1e8 : Number(number) / 1e8
}
