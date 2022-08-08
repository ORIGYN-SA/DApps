import React from 'react'
import { natToFloat } from '@dapp/utils'
import { TokenIcon } from '../TokenIcon'

export const NatPrice = ({ value, symbol }: NatPrice) => {
  if (!symbol) return <>{natToFloat(value)}</>
  return (
    <>
      <TokenIcon symbol={symbol} />
      {natToFloat(value)}
    </>
  )
}

export type NatPrice = {
  value: any
  symbol?: string
}
