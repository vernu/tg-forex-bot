export interface CurrencyPair {
  base: string
  quote: string
}

export interface RateBasic extends CurrencyPair {
  rate: number
}
