const Discord = require("discord.js");
const config = require("../../configLoader");
const fetch = require("node-fetch")
let requestsRemaining = 30;
let uptimeAtLastReset = process.uptime();



async function trnHandler(game,platform,username,m,c) {
	var e = await m.reply({ embed: new Discord.MessageEmbed()
		.setTitle("Working...")
		.setDescription(`Please wait a few seconds`)
		.setColor("#ffdd57") });
    var r = await fetch(`https://public-api.tracker.gg/v2/${game.id}/standard/profile/${platform}/${encodeURIComponent(username)}`,{
        headers: {"TRN-Api-Key": config.trackerNetworkApiKey}
    })
    var j = await r.json()
    if (j.errors) {
        var error = j.errors[0]
        if (error.code == "CollectorResultStatus::NotFound") {
            return e.edit({ embed: new Discord.MessageEmbed()
                .setAuthor("404: Account not found.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                .setColor("#ff3860")
                .setFooter(`Make sure you've got the name correct!`) });
        } else if (error.code == "CollectorResultStatus::CollectionError") {
            return e.edit({ embed: new Discord.MessageEmbed()
                .setAuthor("400: Invalid format!", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                .setColor("#ff3860")
                .setFooter(`Make sure to include the battletag`) });
        } else {
            return e.edit({ embed: new Discord.MessageEmbed()
                .setAuthor("500: " + error.code, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                .setColor("#ff3860")
                .setFooter(error.message) });
        }
    } else {
		var j = j.data
		var embeds = []
		for (var segment of j.segments) {
			var decorators = []
			if (j.userInfo.countryCode) {decorators.push(`:flag_${j.userInfo.countryCode.toLowerCase()}:`)}
			decorators.push("")
			var embed = new Discord.MessageEmbed()
			.setAuthor(`${game.name} Statistics`)
			.setTitle(`${decorators.join(" ")}${j.platformInfo.platformUserHandle} - ${segment.metadata.name}`)
			.setColor(game.color)
			.setFooter("Powered by https://thetrackernetwork.com/")
			for (var stat in segment.stats) {
				embed.addField(segment.stats[stat].displayName,segment.stats[stat].displayValue,true)
			}
			embeds.push(embed)
		}
		e.delete()
		
        return c.paginate(m,embeds)
    }
}

async function trnCmdHandler(game,c,m,a) {
	if (a.length > 2) {
		return m.reply({ embed: new Discord.MessageEmbed()
			.setAuthor("414: Too many arguments.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
			.setColor("#ff3860")
			.setFooter(`This command only accepts 2 arguments, \`platform\` and \`username\`. Try this \`${game.exampleCommand}\` (valid platforms are currently ${game.platforms.join(", ")})`) });
	} else if (a.length == 2) {
		var platform = a[0]
		if (!game.platforms.includes(platform)) {
			return m.reply({ embed: new Discord.MessageEmbed()
				.setAuthor("400: Invalid platform.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
				.setColor("#ff3860")
				.setFooter(`Valid platforms are currently ${game.platforms.join(", ")}`) });
		}
		if (requestsRemaining < 6) {
			return m.reply({ embed: new Discord.MessageEmbed()
				.setAuthor("429: Ratelimited!", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
				.setColor("#ff3860")
				.setFooter(`Try again in ${60 - Math.floor(process.uptime() - uptimeAtLastReset)} seconds.`) });
		}
		trnHandler(game,platform,a[1],m,c)
		
	} else if (a.length < 2) {
		return m.reply({ embed: new Discord.MessageEmbed()
			.setAuthor("400: Too few arguments.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
			.setColor("#ff3860")
			.setFooter(`This command only accepts 2 arguments, \`platform\` and \`username\`. Try this \`${game.exampleCommand}\` (valid platforms are currently ${game.platforms.join(", ")})`) });
	}
}


module.exports = {
	name: "TrackerNetwork",
	author: "theLMGN",
	version: 1,
	description: "Game stats provided by thetrackernetwork.com",
	requiresConfig: "trackerNetworkApiKey",
	commands: [
		{
			name: "ow",
			usage: "battlenet theLMGN#2143",
			description: "Overwatch statistics. (Powered by https://thetrackernetwork.com/, valid platforms are currently `battlenet`,`xbl` and `psn`)",
			execute: async(c, m, a) => {
				await trnCmdHandler({
					id: "overwatch",
					name: "Overwatch",
					logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Overwatch_circle_logo.svg/768px-Overwatch_circle_logo.svg.png",
					color: "#FA9C1E",
					platforms: ["battlenet","xbl","psn"],
					exampleCommand: "b!ow battlenet theLMGN#2143"
				},c,m,a)
			}
		},
		{
			name: "apex",
			usage: "origin thetheLMGN",
			description: "Apex Legends statistics. (Powered by https://thetrackernetwork.com/, valid platforms are currently `origin`,`xbl` and `psn`)",
			execute: async(c, m, a) => {
				await trnCmdHandler({
					id: "apex",
					name: "Apex Legends",
					logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/0/03/Apex_Legends_Logo.png/1200px-Apex_Legends_Logo.png",
					color: "#CD3333",
					platforms: ["origin","xbl","psn"],
					exampleCommand: "b!apex origin thetheLMGN"
				},c,m,a)
			}
		},
		{
			name: "csgo",
			usage: "steam lmgngaming",
			description: "CS:GO statistics. (Powered by https://thetrackernetwork.com/, platform must be `steam`)",
			execute: async(c, m, a) => {
				await trnCmdHandler({
					id: "csgo",
					name: "Counter Strike: Global Offensive",
					logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/CS-GO_Logo.svg/1280px-CS-GO_Logo.svg.png",
					color: "#262E6F",
					platforms: ["steam"],
					exampleCommand: "b!csgo steam lmgngaming"
				},c,m,a)
			}
		}
		,
		{
			name: "division",
			usage: "platform username",
			description: "The Division 2 statistics. (Powered by https://thetrackernetwork.com/, platform must be `uplay`, `xbl` or `psn`)",
			execute: async(c, m, a) => {
				await trnCmdHandler({
					id: "division-2",
					name: "The Division 2",
					logo: "https://upload.wikimedia.org/wikipedia/en/a/af/The_Division_2_art.jpg",
					color: "#FD6B06",
					platforms: ["uplay","xbl","psn"],
					exampleCommand: "b!division platform username"
				},c,m,a)
			}
		}
	],
	events: [
		{
			name: "ready",
			exec: function(c) {
				setInterval(function() {
					requestsRemaining = 30;
					uptimeAtLastReset = process.uptime();
				},60000)
			}
		}
	]
};
