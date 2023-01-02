import { Context } from 'telegraf'
import prismaClient from '../../prisma/prismaClient'

export const logToTgGroup = async (ctx: Context, content: any) => {
    ctx.telegram.sendMessage(
        process.env.TG_LOG_GROUP_CHAT_ID ?? '',
        JSON.stringify(content)
    )
}

export const logToDb = async (ctx: Context, logContent: any) => {
    if (ctx.from?.id) {
        let user = await prismaClient.user.findFirst({
            where: {
                tgUserId: ctx.from.id,
            },
        })

        await prismaClient.log.create({
            data: {
                userId: user?.id,
                content: JSON.parse(logContent),
            },
        })
    }
}