export interface ICurrencyPair {
  base: string
  quote: string
}

export interface IRateBasic extends ICurrencyPair {
  rate: number
}
