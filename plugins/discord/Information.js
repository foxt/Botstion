const Discord = require("discord.js");

function presenceEmoji(presence) {
    if (presence.game && presence.game.streaming) {
        return "<:Streaming:375377712874913792>";
    } else if (presence.status == "online") {
        return "<:Online:375377712753147904>";
    } else if (presence.status == "offine") {
        return "<:Offline:375377712589832203>";
    } else if (presence.status == "away") {
        return "<:Away:375377712413540363>";
    } else if (presence.status == "dnd") {
        return "<:DND:375377716775485461>";
    } else {
        return "";
    }
}
const clientPresenseEmojiMap = {
    web: {
        online: "<:OnlineOnWeb:627611397659951134>",
        idle: "<:IdleOnWeb:627611397735579668>",
        dnd: "<:DNDOnWeb:627611397647499280>"
    },
    desktop: {
        online: "<:OnlineOnDesktop:627611397601099854>",
        idle: "<:IdleOnDesktop:627611397676597248>",
        dnd: "<:DNDOnDesktop:627611397328470018>"
    },
    mobile: {
        online: "<:OnlineOnMobile:627611397387452457>",
        idle: "<:IdleOnMobile:627611397672665128>",
        dnd: "<:DNDOnMobile:627611397647499264>"
    }
};


function clientPresenseEmoji(client, presence) {
    try {
        let e = clientPresenseEmojiMap[client][presence];
        if (e) { return e; } else { return presence + " on " + client; }
    } catch (e) {
        return presence + " on " + client;
    }
}

async function processUser(user, c) {
    let embed = new Discord.MessageEmbed()
        .setTitle(`${presenceEmoji(user.presence)} ${user.typingIn(c) ? ":keyboard:" : ""} ${user.tag} ${user.bot ? "<:BOT:375377712648421386>" : ""}`)
        .setAuthor(`Profile for ${user.tag}`, user.avatarURL)
        .setColor("#3273dc")
        .setThumbnail(user.avatarURL({ size: 256 }));
    embed.addField(":hash: User's name and discrim", user.tag);
    embed.addField("<:mention:406520790402727937> User's mention", user.toString(), true);
    embed.addField(":id: User ID", user.id, true);
    if (user.avatarURL) {
        embed.addField(":frame_photo: Profile Picture", `[User](${user.avatarURL({ size: 2048, format: "png" })}) [Animated](${user.avatarURL({ format: "gif" })}) [Default](${user.defaultAvatarURL})`);
    } else {
        embed.addField(":frame_photo: Profile Picture", `[User hasn't set a profile picture, but here's their colored Discord logo](${user.defaultAvatarURL})`);
    }
    embed.addField(":birthday: Discord Birthday (creation date)", user.createdAt.toString());
    try {
        let pres = await c.guild.members.fetch(user.id);
        if (pres.premiumSince) { embed.addField(":sparkles: Boosting since", new Date(pres.premiumSince).toLocaleString()); }
        if (pres.nickname) { embed.addField(":label: Nickname", pres.nickname); }
        if (pres.joinedTimestamp) { embed.addField(":door: Joined at", new Date(pres.joinedTimestamp).toLocaleString()); }
        if (pres.displayColor != "#000000") embed.setColor(pres.displayColor);
        if (pres.lastMessageID) { embed.addField(":e_mail: Last seen", `[Here!](https://canary.discord.com/channels/${c.guild.id}/${pres.lastMessageChannelID}/${pres.lastMessageID})`); }
        if (pres.voice.channelID) {
            embed.addField(":microphone2: In voice", `<#${pres.voice.channelID}> ${pres.voice.speaking ? ":microphone:" : ""}${pres.voice.mute ? "" : ":microphone2:"}${pres.voice.deaf ? ":mute:" : ":speaker:"}${pres.voice.selfVideo ? ":camera:" : ""}${pres.voice.streaming ? ":video_camera:" : ""}`);
        }
        embed.setColor(pres.displayColor);
    } catch (e) {
        console.error("[Profile		]", e);
    }
    if (user.presence.status == "offline") {
        return embed;
    }
    try {
        let pres = (await c.guild.members.fetch(user.id)).presence.clientStatus;
        let a = "";
        for (let p in pres) {
            a += clientPresenseEmoji(p, pres[p]);
        }
        embed.addField(`${presenceEmoji(user.presence)} Status`, a, true);
    } catch (e) {
        embed.addField(`${presenceEmoji(user.presence)} Status`, user.presence.status, true);
    }
    if (user.presence.activities && user.presence.activities[0]) {
        let activities = [];
        for (let activity of user.presence.activities) {
            if (activity.type == "CUSTOM_STATUS") {
                activities.push((activity.emoji ? activity.emoji.name : ":smiley:") + " " + (activity.state || ""));
            } else {
                activities.push((activity.details || activity.applicationID ? "<:rich_presence:696433216801734736> " : ":video_game: ") + activity.name);
            }
        }
        embed.addField(`:video_game: ${activities.length == 1 ? "Activity" : "Activities"}`, activities.join(", "), true);
    }



    return embed;
}


module.exports = {
    name: "Information",
    author: "theLMGN",
    version: 1,
    description: "A plugin that includes the serverinfo, server emoji and profile commands, for viewing metadata on guilds (and it's emojis) and user (Ported from Botstion3)",
    commands: [
        {
            name: "serverinfo",
            description: "Shows you information about the current guild",
            stipulations: {
                context: 1
            },
            category: "Utilities",
            execute: async (c, m) => {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Here's some info about this server!")
                    .setColor("#3273dc");
                if (m.guild.afkChannel && m.guild.afkTimeout) {
                    embed.addField(":zzz: AFK", `<#${m.guild.afkChannelID}> (${m.guild.afkTimeout / 60} mins)`);
                }
                embed.addField(":hash: Channel count", `${m.guild.channels.cache.size}`);
                embed.addField(":calendar_spiral: Created", `${m.guild.createdAt}`);
                embed.addField(":smile: Emojis", `${m.guild.emojis.cache.size} (use b!semojis to view them)`);
                if (m.guild.icon) {
                    embed.addField(":frame_photo: Icon URL", `[${m.guild.icon}](${m.guild.iconURL()})`);
                }
                embed.addField(":calendar: Joined at", `${m.guild.joinedAt}`);
                embed.addField(":busts_in_silhouette: Members", `${m.guild.memberCount}`);
                embed.addField(":pencil: Server name and acronym", `${m.guild.name} (${m.guild.nameAcronym})`);
                embed.addField(":bust_in_silhouette: Owner", `${m.guild.owner}`);
                embed.addField(":map: Region", `${m.guild.region}`);
                m.reply({ embeds: [embed] });
            }
        },
        {
            name: "profile",
            usage: "user[] optional user=<@158311402677731328>",
            description: "Shows you information on the specified user(s)",
            category: "Utilities",
            execute: async (c, m, a) => {
                let embeds = [];
                a.user = a.user || [];
                if (!a.user.length) a.user = [a.user];
                for (let element of a.user) {
                    if (typeof element == "undefined" || !element || !element.username) continue;
                    embeds.push(await processUser(element, m.channel));
                }
                if (embeds.length <= 0) {
                    embeds.push(await processUser(m.author, m.channel));
                }
                return m.reply({ embeds });
            }
        },
        {
            name: "semojis",
            description: "Shows you the emojis in the server.",
            stipulations: {
                context: 1
            },
            category: "Utilities",
            execute: async (c, m) => {
                m.reply({ embeds: [new Discord.MessageEmbed().setTitle(`${m.guild.name} has ${m.guild.emojis.cache.size} emoji(s)`)
                    .setDescription(`${m.guild.emojis.cache.array().join("")}`)
                    .setColor("#3273dc")
                ] });
            }
        }
    ]
};
