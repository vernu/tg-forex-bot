import {
  fetchLatestRates,
  getAllRatesResponseHTML,
} from './utils/currencyUtils'
import * as dotenv from 'dotenv'
dotenv.config()
import { Telegraf } from 'telegraf'
import { adminHandler } from './handlers/adminHandler'
import { mainHandler } from './handlers/mainHandler'
import { subscriptionHandler } from './handlers/subscriptionHandler'
import { logToDb, logToTgGroup } from './utils/logUtils'
import cron from 'node-cron'
import prismaClient from '../prisma/prismaClient'

const bot = new Telegraf(process.env.BOT_TOKEN ?? '')

if (process.env.ENVIRONMENT === 'prod') {
  bot.telegram.setWebhook(
    `${process.env.WEBHOOK_URL}/bot${process.env.BOT_TOKEN}`
  )
}
bot.launch()

// handle log
bot.use(async (ctx, next) => {
  // const user = await getOrCreateUser(ctx.from?.id)
  // ctx.state.user = user

  const logContent = {
    trigger: 'BOT_USE',
    env: process.env.ENVIRONMENT,
    update: ctx.update,
    updatetype: ctx.updateType,
  }

  try {
    await logToTgGroup(ctx, logContent)
    await logToDb(ctx, logContent)
  } catch (e) {
    console.log(e)
  }

  next()
})

adminHandler(bot)
mainHandler(bot)
subscriptionHandler(bot)

cron.schedule(
  '0 0 6 * * *',
  async () => {
    const subscriptions = await prismaClient.subscription.findMany({
      where: {},
      include: {
        user: true,
      },
    })

    if (subscriptions.length === 0) {
      console.log('no subscriptions')
      return
    }

    const responseHTML = await getAllRatesResponseHTML()
    for (const subscription of subscriptions) {
      bot.telegram.sendMessage(`${subscription.user.tgUserId}`, responseHTML, {
        parse_mode: 'HTML',
      })
    }
  },
  {
    timezone: 'Africa/Addis_Ababa',
  }
)

cron.schedule('0 0 */6 * * *', async () => {
  fetchLatestRates()
})

// Enable graceful stop
process.once('SIGINT', () => {
  bot.stop('SIGINT')
})
process.once('SIGTERM', () => {
  bot.stop('SIGTERM')
})
