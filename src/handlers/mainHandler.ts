import { Telegraf } from 'telegraf'
import prismaClient from '../../prisma/prismaClient'
import { DEFAULT_CURRENCY_PAIRS } from '../constants'
import { getLatestRate } from '../utils/currencyUtils'
import { getTgProfilePicUrl } from '../utils/tgUtils'

export const mainHandler = (bot: Telegraf) => {
    bot.start(async (ctx) => {
        let user = await prismaClient.user.findFirst({
            where: {
                tgUserId: ctx.from.id,
            },
        })
        let isNewUser = false
        const profilePicUrl = await getTgProfilePicUrl(ctx)
        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    name: `${ctx.from.first_name} ${ctx.from.last_name ?? ''}`.trim(),
                    tgUserId: ctx.from.id,
                    tgUsername: ctx.from.username,
                    tgLatestProfilePic: profilePicUrl,
                },
            })
            isNewUser = true
        } else {
            user = await prismaClient.user.update({
                where: {
                    tgUserId: ctx.from.id,
                },
                data: {
                    tgLatestProfilePic: profilePicUrl,
                },
            })
        }

        ctx.reply(`welcome ${!isNewUser ? 'back ' : ''} ${user.name}(${user.tgUsername})`)
    })
    bot.hears(['all', 'All', 'ALL'], async (ctx) => {
        const currencyPairs = DEFAULT_CURRENCY_PAIRS
        const result = []

        for (const pair of currencyPairs) {
            const rate = await getLatestRate(pair)
            rate && result.push(rate)
        }

        let response = ''

        for (const [i, val] of result.entries()) {
            if ([2, 4, 8].includes(i)) response += '\n'

            response += `${val.base}/${val.quote} ${val.rate.toLocaleString('en-US')}\n`
        }

        ctx.replyWithHTML(response, {
            // add an inline keyboard option
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Subscribe',
                            callback_data: 'subscribe',
                        },
                    ],
                ],
            },


        })
    })
}