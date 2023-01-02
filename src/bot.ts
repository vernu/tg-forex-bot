import * as dotenv from 'dotenv'
dotenv.config()
import { Telegraf } from 'telegraf'
import { adminHandler } from './handlers/adminHandler'
import { mainHandler } from './handlers/mainHandler'
import { subscriptionHandler } from './handlers/subscriptionHandler'
import { junk } from './junk'
import { logToDb, logToTgGroup } from './utils/logUtils'

const bot = new Telegraf(process.env.BOT_TOKEN ?? '')


if (process.env.ENVIRONMENT === 'prod') {
  bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/bot${process.env.BOT_TOKEN}`)
}
bot.launch()

// TODO: remove this
junk(bot)

// handle log
bot.use(async (ctx, next) => {

  // const user = await getOrCreateUser(ctx.from?.id)
  // ctx.state.user = user

  const logContent = {
    trigger: 'BOT_USE',
    update: ctx.update,
    updatetype: ctx.updateType,
  }


  await logToTgGroup(ctx, logContent)
  await logToDb(ctx, logContent)

  next()
})


adminHandler(bot)
mainHandler(bot)
subscriptionHandler(bot)

// Enable graceful stop
process.once('SIGINT', () => {
  bot.stop('SIGINT')
})
process.once('SIGTERM', () => {
  bot.stop('SIGTERM')
})
