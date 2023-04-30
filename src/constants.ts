import { CurrencyPair } from './types'

export const SUPPORTED_CURRENCIES = [
  'ETB',
  'EUR',
  'GBP',
  'BTC',
  'ETH',
  'ETB',
  'CAD',
  'SOL',
  'ADA',
  'DOGE',
  'LTC',
  'USDT',
  'USDC',
  'JPY',
]

export const DEFAULT_CURRENCY_PAIRS: CurrencyPair[] = [
  { base: 'BTC', quote: 'USD' },
  { base: 'ETH', quote: 'USD' },

  { base: 'BTC', quote: 'ETB' },
  { base: 'ETH', quote: 'ETB' },

  { base: 'USD', quote: 'ETB' },
  { base: 'CAD', quote: 'ETB' },
  { base: 'EUR', quote: 'ETB' },
  { base: 'GBP', quote: 'ETB' },

  { base: 'GBP', quote: 'USD' },
  { base: 'EUR', quote: 'USD' },
  //   { base: 'SOL', quote: 'USD' },
  //   { base: 'ADA', quote: 'USD' },
  //   { base: 'DOGE', quote: 'USD' },
  //   { base: 'LTC', quote: 'USD' },
]

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  REGULAR = 'REGULAR',
}