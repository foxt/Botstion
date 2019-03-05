const Discord = require("discord.js");
const config = require("../configLoader");
const {get} = require("snekfetch");
let requestsRemaining = 30;
let uptimeAtLastReset = process.uptime();

module.exports = {
	name: "Fortnite",
	author: "theLMGN",
	version: 1,
	description: "Fortnite stats provided by fortnitetracker.com",
	requiresConfig: "trackerNetworkApiKey",
	commands: [
		{
			name: "fortnite",
			usage: "pc theLMGN",
			description: "Fortnite statistics. (Powered by https://fortnitetracker.com/, valid platforms are currently `pc`,`xbl` and `psn`)",
			execute: async(c, m, a) => {
				if (a.length > 2) {
					return m.reply({ embed: new Discord.MessageEmbed()
						.setAuthor("414: Too many arguments.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")
						.setFooter('This command only accepts 2 arguments, `platform` and `epicUsername`. Try this `b!fortnite pc theLMGN` (valid platforms are currently `pc`,`xbl` and `psn`)') });
				} else if (a.length == 2) {
					var platform = a[0]
					if (a[0] == "pc") {
					} else if (a[0] == "xbl") {
					} else if (a[0] == "psn") {
					} else {
						return m.reply({ embed: new Discord.MessageEmbed()
							.setAuthor("400: Invalid platform.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
							.setColor("#ff3860")
							.setFooter('Valid platforms are currently `pc`,`xbl` and `psn`') });
					}
					if (requestsRemaining < 6) {
						return m.reply({ embed: new Discord.MessageEmbed()
							.setAuthor("429: Ratelimited!", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
							.setColor("#ff3860")
							.setFooter(`Try again in ${60 - Math.floor(process.uptime() - uptimeAtLastReset)} seconds.`) });
					}
					var e = await m.reply({ embed: new Discord.MessageEmbed()
						.setTitle("Working...")
						.setDescription(`Please wait a few seconds`)
						.setColor("#ffdd57") });
					get(`https://api.fortnitetracker.com/v1/profile/${platform}/${a[1]}`).set("TRN-Api-Key", config.trackerNetworkApiKey).send().then(function(r) {
						var j = r.body
						if (j.error) {
							if (j.error == "Player Not Found") {
								return e.edit({ embed: new Discord.MessageEmbed()
									.setAuthor("404: Account not found.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
									.setColor("#ff3860")
									.setFooter(`Make sure you've got the name correct!`) });
							} else {
								return e.edit({ embed: new Discord.MessageEmbed()
									.setAuthor("500: Something broke", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
									.setColor("#ff3860")
									.setFooter(j.error) });
							}
						} else {
							var emb = new Discord.MessageEmbed()
							.setAuthor(`[${j.platformNameLong}] ${j.epicUserHandle}`)
							.setColor("#23d160")
							.setFooter("Epic Account ID: " + j.accountId + " (powered by fortnitetracker.com)")
							.setThumbnail("https://i.imgur.com/QDzGMB8.png")
							.setURL(`https://fortnitetracker.com/profile/${j.platformName}/${j.epicUserHandle}`)
							.setDescription(`[View full stats on FortniteTracker.com](https://fortnitetracker.com/profile/${j.platformName}/${j.epicUserHandle})`)
							for (var stat of j.lifeTimeStats) {
								emb.addField(stat.key,stat.value, true);
							}
							return e.edit({ embed: emb });
						}
					})
				} else if (a.length < 2) {
					return m.reply({ embed: new Discord.MessageEmbed()
						.setAuthor("400: Too few arguments.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")
						.setFooter('This command only accepts 2 arguments, `platform` and `epicUsername`. Try this `b!fortnite pc theLMGN` (valid platforms are currently `pc`,`xbl` and `psn`)') });
				}
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
	],
	timer: [],
};
