import axios from 'axios'
import prismaClient from '../../prisma/prismaClient'
import { DEFAULT_CURRENCY_PAIRS, SUPPORTED_CURRENCIES } from '../constants'
import { CurrencyPair, RateBasic } from '../types'

export const fetchLatestRates = async (): Promise<void> => {
  const res = await axios.get(
    `https://api.currencyfreaks.com/latest?apikey=${process.env.CURRENCY_FREAKS_API_KEY}`
  )

  for (let val of SUPPORTED_CURRENCIES) {
    if (res.data.rates[val]) {
      await prismaClient.rate.create({
        data: {
          base: 'USD',
          quote: val,
          rate: Number(res.data.rates[val]),
        },
      })
    }
  }
}

export const getLatestRate = async ({
  base,
  quote,
}: CurrencyPair): Promise<RateBasic | null> => {
  if (base == 'USD') {
    let result = await prismaClient.rate.findFirst({
      where: {
        base,
        quote,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    if (result) return { base, quote, rate: result.rate }
  } else if (quote == 'USD') {
    let result = await prismaClient.rate.findFirst({
      where: {
        base: quote,
        quote: base,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    if (result) return { base, quote, rate: 1 / result.rate }
  } else {
    let usdBase = await prismaClient.rate.findFirst({
      where: {
        base: 'USD',
        quote: base,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    let usdQuote = await prismaClient.rate.findFirst({
      where: {
        base: 'USD',
        quote,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (usdBase && usdQuote)
      return { base, quote, rate: usdQuote.rate / usdBase.rate }
  }

  return null
}

export const getAllRatesResponseHTML = async (): Promise<string> => {
  const currencyPairs = DEFAULT_CURRENCY_PAIRS
  const result = []

  for (const pair of currencyPairs) {
    const rate = await getLatestRate(pair)
    rate && result.push(rate)
  }

  let dateStr = new Date().toLocaleString('en-US', {
    timeZone: 'Africa/Addis_Ababa',
  })
  dateStr = dateStr.split(',')[0].trim()
  let response = `Latest Rates - ${dateStr} \n\n`

  for (const [i, val] of result.entries()) {
    if ([2, 4, 8].includes(i)) response += '\n'
    response += `${val.base}/${val.quote} ${val.rate.toLocaleString('en-US')}\n`
  }

  return response
}
