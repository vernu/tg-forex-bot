export const getTgProfilePicUrl = async (ctx: any): Promise<string | null> => {
    let { total_count, photos } = await ctx.telegram.getUserProfilePhotos(
        ctx.message.from.id
    )
    if (total_count > 0) {
        return (await ctx.telegram.getFileLink(photos[0][2].file_id)).href
    }
    return null
}