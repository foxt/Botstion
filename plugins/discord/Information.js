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
var clientPresenseEmojiMap = {
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
}
function clientPresenseEmoji(client,presence) {
	try {
		var e = clientPresenseEmojiMap[client][presence]
		if (e) {return e} else { return presence + " on " + client}
	} catch(e) {
		return presence + " on " + client
	}
}
function messageToGuild(m) {
	if (m.channel.guild) {
		return `(in ${m.channel.guild.name})`;
	} else {
		return "(in DMs)";
	}
}
function playingType(user) {
	if (user.presence.game.type == 0) {
		return "Playing";
	} else if (user.presence.game.type == 2) {
		return "Watching";
	} else if (user.presence.game.type == 3) {
		return "Listening to";
	}
}

function processUser(user, c) {
	var embed = new Discord.MessageEmbed()
		.setTitle(`${presenceEmoji(user.presence)} ${user.typingIn(c) ? ":keyboard:" : ""} ${user.tag} ${user.bot ? "<:BOT:375377712648421386>" : ""}`)
		.setAuthor(`Profile for ${user.tag}`, user.avatarURL)
		.setColor("#3273dc")
		.setThumbnail(user.avatarURL({ size: 256 }));
	if (user.avatarURL) {
		embed.addField(":frame_photo: Profile Picture", `[User](${user.avatarURL({ size: 2048, format: "png" })}) [Animated](${user.avatarURL({ format: "gif" })}) [Default](${user.defaultAvatarURL})`);
	} else {
		embed.addField(":frame_photo: Profile Picture", `[User hasn't set a profile picture, but here's their colored Discord logo](${user.defaultAvatarURL})`);
	}
	embed.addField(":birthday: Discord Birthday (creation date)", user.createdAt.toString());
	if (user.dmChannel) {
		embed.addField(":mailbox_with_mail:  User has had DM conversation with me.", "<:Tick:375377712786833419> ");
	} else {
		embed.addField(":mailbox_with_no_mail:  User has had DM conversation with me.", "<:Cross:375377712367534082>");
	}
	embed.addField(":id: User ID", user.id);
	if (user.lastMessage && user.lastMessage.editedAt) { embed.addField(":e_mail: Last active", user.lastMessage.editedAt); }
	if (user.presence.game) {
		if (user.presence.game.streaming) {
			embed.addField(`Streaming`, `[${user.presence.game.name}](${user.presence.url})`);
		} else {
			embed.addField(`${playingType(user)}`, user.presence.game.name);
		}
	}
	try {
		var pres = c.guild.members.get(user.id).presence.clientStatus
		var a = ""
		for (var p in pres) {
			a += clientPresenseEmoji(p,pres[p])
		}
		embed.addField(`${presenceEmoji(user.presence)} Status`, a);
	} catch(e) {
		embed.addField(`${presenceEmoji(user.presence)} Status`, user.presence.status);
	}

	embed.addField(":hash: User's name and discrim", user.tag);
	embed.addField("<:mention:406520790402727937> User's mention", user.toString());
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
			usage: "",
			description: "Shows you information about the current guild",
			execute: async(c, m, a) => {
				if (m.channel.guild) {
					var embed = new Discord.MessageEmbed()
						.setTitle(`Here's some info about this server!`)
						.setColor("#3273dc");
					if (m.guild.afkChannel && m.guild.afkTimeout) {
						embed.addField(":zzz: AFK", `<#${m.guild.afkChannelID}> (${m.guild.afkTimeout / 60} mins)`);
					}
					embed.addField(":hash: Channel count", `${m.guild.channels.array().length}`);
					embed.addField(":calendar_spiral: Created", `${m.guild.createdAt}`);
					embed.addField(":smile: Emojis", `${m.guild.emojis.array().length} (use b!semojis to view them)`);
					if (m.guild.icon) {
						embed.addField(":frame_photo: Icon URL", `[${m.guild.icon}](${m.guild.iconURL()})`);
					}
					embed.addField(":calendar: Joined at", `${m.guild.joinedAt}`);
					embed.addField(":busts_in_silhouette: Members", `${m.guild.memberCount}`);
					embed.addField(":pencil: Server name and acronym", `${m.guild.name} (${m.guild.nameAcronym})`);
					embed.addField(":bust_in_silhouette: Owner", `${m.guild.owner}`);
					embed.addField(":map: Region", `${m.guild.region}`);
					m.reply({ embed: embed });
				} else {
					m.reply({ embed: new Discord.MessageEmbed()
						.setAuthor("404: Guild not found.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")
						.setFooter(`It seems this command was ran in DMs, but it's required to be ran in a server, not through DMs.`) });
				}
			},
		},
		{
			name: "profile",
			usage: "<@158311402677731328>",
			description: "Shows you information on the specified user(s)",
			execute: async(c, m, a) => {
				var embeds = []
				for (var element of m.mentions.users.array()) {
					embeds.push(processUser(element, m.channel));
				}
				embeds.push(processUser(m.author, m.channel));
				if (embeds.length > 1) {
					c.paginate(m,embeds)
				} else if (embeds.length == 1) {
					m.reply(embeds[0])
				} else {
					throw new Error(embeds.length + " embeds")
				}
			},
		},
		{
			name: "semojis",
			usage: "",
			description: "Shows you the emojis in the server.",
			execute: async(c, m, a) => {
				if (m.channel.guild) {
					m.reply({ embed: new Discord.MessageEmbed().setTitle(`${m.guild.name} has ${m.guild.emojis.array().length} emoji(s)`)
						.setDescription(`${m.guild.emojis.array().join("")}`)
						.setColor("#3273dc"),
					});
				} else {
					m.reply({ embed: new Discord.MessageEmbed()
						.setAuthor("404: Guild not found.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")
						.setFooter(`It seems this command was ran in DMs, but it's required to be ran in a server, not through DMs.`) });
				}
			},
		},
	]
};
