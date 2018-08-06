const Discord = require("discord.js");
const conf = require("../config/config.json");
const {get} = require("snekfetch");
let lastRequest = 0;

module.exports = {
	name: "ipinfo.io",
	author: "theLMGN",
	version: 1,
	description: "ipinfo.io API support",
	requiresConfig:"ipinfoioToken",
	commands: [
		{
			name: "ip",
			usage: "8.8.8.8",
			description: "ipinfo.io support",
			execute: async(c, m, a) => {
				if (a.length > 1) {
					return m.reply({ embed: new Discord.MessageEmbed()
						.setAuthor("414: Too many arguments.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")
						.setFooter('This command only accepts 1 argument, `iporasn`. Try this: `b!ip 8.8.8.8` or `b!ip AS15169`') });
				} else if (a.length == 1) {
					if (a[0] == "") {
						return m.reply({ embed: new Discord.MessageEmbed()
							.setAuthor("414: Too many arguments.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
							.setColor("#ff3860")
							.setFooter('This command only accepts 1 argument, `iporasn`. Try this `b!ip 8.8.8.8`') });
					} else {
						var e = await m.reply({ embed: new Discord.MessageEmbed()
							.setTitle("Working...")
							.setDescription(`Please wait a few seconds`)
							.setColor("#ffdd57") });
						get(`https://ipinfo.io/${a[0]}/json`).set("Authorization", "Bearer" + conf.ipinfoioToken).send().then( async function(r) {

							var j = r.body

							if (j.error) {
								if (j.error.title) {
									return e.edit({ embed: new Discord.MessageEmbed()
										.setAuthor(j.error.title, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
										.setColor("#ff3860")
										.setFooter(j.error.message) });
								} else {
									return e.edit({ embed: new Discord.MessageEmbed()
										.setAuthor(j.error, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
										.setColor("#ff3860")
										.setFooter("This usually means **you** broke something.")});
								}
							} else {
								if (j.ip) {
									var emb = new Discord.MessageEmbed()
									.setTitle(j.ip)
									.setDescription(`[Data from ipinfo.io](https://ipinfo.io/${j.ip})`)
									.setColor("#23d160")
									if (j.hostname) {
										emb.addField(`:shield: Hostname`, j.hostname, false);
									}
									if (j.city) {
										emb.addField(`:cityscape: City`, j.city, true);
									}
									if (j.region) {
										emb.addField(`:homes: Region`, j.region, true);
									}
									if (j.country) {
										emb.setTitle(`:flag_${j.country.toLowerCase()}: ${j.ip}`, true);
									}
									if (j.org) {
										emb.addField(`:globe_with_meridians: Network`, j.org, true);
									}
									if (j.bogon) {
										emb.addField(':information_source: Bogon!', " This is a [bogon](https://en.wikipedia.org/wiki/Reserved_IP_addresses)/[reserved](https://en.wikipedia.org/wiki/Bogon_filtering) IP address!", true)
									}

									if (j.loc) {
										emb.setThumbnail(`https://maps.googleapis.com/maps/api/staticmap?center=${j.loc}&zoom=10&size=1000x1000&sensor=false&key=${conf.googleApi}`, true)
									}
									return e.edit({ embed:emb });
								}
							}
						}).catch(function(er) {
							console.log(er)
							try {
								var j = r.body
								if (j.error) {
									if (j.error.title) {
										return e.edit({ embed: new Discord.MessageEmbed()
											.setAuthor(j.error.title, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
											.setColor("#ff3860")
											.setFooter(j.error.message) });
									} else {
										return e.edit({ embed: new Discord.MessageEmbed()
											.setAuthor(j.error, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
											.setColor("#ff3860")
											.setFooter("This usually means you did something wrong.")});
									}
								} else {
									return e.edit({ embed: new Discord.MessageEmbed()
										.setAuthor(er.toString(), "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
										.setDescription(er.stack)
										.setColor("#ff3860")
										.setFooter("This usually means we did something wrong. Report it in the support server.")});
								}
							} catch (err) {
								return e.edit({ embed: new Discord.MessageEmbed()
									.setAuthor(er.toString(), "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
									.setDescription(er.stack)
									.setColor("#ff3860")
									.setFooter("This usually means we did something wrong. Report it in the support server.")});
							}

						})
					}


				} else if (a.length < 2) {
					return m.reply({ embed: new Discord.MessageEmbed()
						.setAuthor("414: Too many arguments.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")
						.setFooter('This command only accepts 1 argument, `iporasn`. Try this `b!ip 8.8.8.8`') });
				}
			}
		}
	],
	events: [],
	timer: [],
};
