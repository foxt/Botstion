const Discord = require("discord.js");
const bot = new Discord.Client;
const fs = require("fs")

exports.run = async(Client,Message,Arguments) => {
    var embed = new Discord.RichEmbed()
    .setTitle(`Here's some info about this server!`)
    .setColor("#3273dc")
    if (Message.guild.afkChannel && Message.guild.afkTimeout) {
        embed.addField(":zzz: AFK", `<#${Message.guild.afkChannelID}> (${Message.guild.afkTimeout / 60} mins)`)
    }
    embed.addField(":hash: Channel count", `${Message.guild.channels.array().length}`)
    embed.addField(":calendar_spiral: Created", `${Message.guild.createdAt}`)
    embed.addField(":smile: Emojis", `${Message.guild.emojis.array().length} (use b!semojis to view them)`)
    if (Message.guild.icon) {
        embed.addField(":frame_photo: Icon URL", `[${Message.guild.icon}](${Message.guild.iconURL})`)
    }
    embed.addField(":calendar: Joined at", `${Message.guild.joinedAt}`)
    embed.addField(":busts_in_silhouette: Members", `${Message.guild.memberCount}`)
    embed.addField(":pencil: Server name and acronym", `${Message.guild.name} (${Message.guild.nameAcronym})`)
    embed.addField(":bust_in_silhouette: Owner", `${Message.guild.owner}`)
    embed.addField(":map: Region", `${Message.guild.region}`)
    Message.reply({ embed: embed})
}
exports.permission = 1
exports.help = {descrip: "Shows you information about this server", example: "serverinfo"}