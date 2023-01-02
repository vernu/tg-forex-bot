import { Telegraf } from 'telegraf'
import prismaClient from '../../prisma/prismaClient'

export const subscriptionHandler = async (bot: Telegraf) => {

    bot.command('subscribe', async (ctx) => {
        let subscription = await prismaClient.subscription.findFirst({
            where: {
                user: { tgUserId: ctx.from.id },
            },
        })

        if (subscription) {
            ctx.reply('already subscribed')
            return
        }

        const user = await prismaClient.user.findFirstOrThrow({
            where: {
                tgUserId: ctx.from.id,
            },
        })

        await prismaClient.subscription.create({
            data: {
                userId: user.id,
                base: 'ETB',
            },
        })

        ctx.reply('subscribed')
    })

    bot.command('unsubscribe', async (ctx) => {
        const user = await prismaClient.user.findFirstOrThrow({
            where: {
                tgUserId: ctx.from.id,
            },
        })

        const subscription = await prismaClient.subscription.delete({
            where: {
                userId: user.id,
            },
        })

        ctx.reply('unsubscribed')
    })

}