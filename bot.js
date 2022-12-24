import * as dotenv from 'dotenv'
dotenv.config()
import { Telegraf } from 'telegraf'

const bot = new Telegraf(process.env.BOT_TOKEN)


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => {
  bot.stop('SIGINT')
})
process.once('SIGTERM', () => {
  bot.stop('SIGTERM')
})
