import { Telegraf } from 'telegraf'
import prismaClient from '../prisma/prismaClient'

export const junk = (bot: Telegraf) => {


    bot.hears(['verify-phone'], async (ctx) => {
        ctx.reply('Send me your number please', {
            reply_markup: {
                keyboard: [[{ text: 'Verify phone number', request_contact: true }]],
                inline_keyboard: [
                    [
                        {
                            text: 'Verify phone ',
                            callback_data: 'verify-phone',
                        },
                    ],
                ],
            },



        })
    })

    bot.on('contact', async (ctx) => {
        console.log(ctx.message.contact)

        await prismaClient.user.update({
            where: {
                tgUserId: ctx.message.contact.user_id,
            },
            data: {
                phone: ctx.message.contact.phone_number,
            },
        })
        ctx.reply('hi')
    })

}