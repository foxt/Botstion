const Discord = require("discord.js");

function presenceEmoji(presence) {
    if (presence.game && presence.game.streaming) {
        return "<:Streaming:375377712874913792>"
    } else if (presence.status == "online") {
        return "<:Online:375377712753147904>"
    } else if (presence.status == "offine") {
        return "<:Offline:375377712589832203>"
    } else if (presence.status == "away") {
        return "<:Away:375377712413540363>"
    } else if (presence.status == "dnd") {
        return "<:DND:375377716775485461>"
    } else {
        return ""
    }
}
function messageToGuild(m) {
    if (m.channel.guild) { return "(in " +m.channel.guild.name + ")"} else { return "(in DMs)"}
}
function playingType(user) {
    if (user.presence.game.type == 0) {
        return "Playing"
    } else if (user.presence.game.type == 2) {
        return "Watching"
    } else if (user.presence.game.type == 3) {
        return "Listening to"
    }
}

function processUser(user,c) {
    var embed = new Discord.RichEmbed()
    .setTitle(`${presenceEmoji(user.presence)} ${user.typingIn(c) ? ":keyboard:" : ""} ${user.tag} ${user.bot ? "<:BOT:375377712648421386>" : ""}`)
    .setAuthor(`Profile for ${user.tag}`, user.avatarURL)
    .setColor("#3273dc")
    .setThumbnail(user.displayAvatarURL )
    if (user.avatarURL) {
        embed.addField(":frame_photo: Profile Picture", `[User](${user.avatarURL}) [Default](${user.defaultAvatarURL})`)
    } else {
        embed.addField(":frame_photo: Profile Picture", `[User hasn't set a profile picture, but here's their colored Discord logo](${user.defaultAvatarURL})`)
    }
    embed.addField(":birthday: Discord Birthday (creation date)", user.createdAt.toString())
    if (user.dmChannel) {embed.addField(":mailbox_with_mail:  User has had DM conversation with me.", "<:Tick:375377712786833419> ")} 
    else { embed.addField(":mailbox_with_no_mail:  User has had DM conversation with me.", "<:Cross:375377712367534082>") }
    embed.addField(":id: User ID", user.id)
    if (user.lastMessage && user.lastMessage.editedAt) {embed.addField(":e_mail: Last active", user.lastMessage.editedAt)}
    if (user.presence.game) {
        if (user.presence.game.streaming) {
            embed.addField(presenceEmoji(user.presence) + " Streaming", `[${user.presence.game.name}](${user.presence.url})`)
        } else {
            embed.addField(presenceEmoji(user.presence) + " " + playingType(user), user.presence.game.name)
        }
    }
    else {
        embed.addField(presenceEmoji(user.presence) + " Status", user.presence.status)
    }
    
    embed.addField(":hash: User's name and discrim", user.tag)
    embed.addField("<:mention:406520790402727937> User's mention", user.toString())
    return embed
}
exports.run = async(client,msg,args) => {
     let embeds = []
    msg.mentions.users.array().forEach(element => {
        embeds.push(processUser(element,msg.channel))
    });
    embeds.push(processUser(msg.author,msg.channel))
    require("../utils/paginator")(client,embeds,msg)
}
exports.permission = 1
exports.help = {descrip: "Gives you information on your self and any mentioned users.", example: "profile <@321746347550310411> <@158311402677731328>"}