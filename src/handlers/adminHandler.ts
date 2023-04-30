import { Telegraf } from 'telegraf'
import { fetchLatestRates } from '../utils/currencyUtils'

export const adminHandler = (bot: Telegraf) => {
    bot.command('fetch', async (ctx) => {
        // TODO: check if user is admin
        await fetchLatestRates()
        ctx.reply('fetching...')
    })
}