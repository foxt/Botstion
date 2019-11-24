const Discord = require("discord.js");
const config = require("../../configLoader");
const url = require("url");
const fetch = require("node-fetch");
const lyr = require("lyricist");
var ly = null;


module.exports = {
	name: "Genius Lyrics",
	author: "theLMGN",
	version: 1,
	description: "Lyrics from genius.com (Ported from Botstion3)",
	requiresConfig: "geniusAccessToken",
	commands: [
		{
			name: "lyrics",
			usage: "Junction Seven",
			description: "Lyrics from Genius.com",
			execute: async(c, msg, args) => {
				var r = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(args.join(" "))}`, {headers: {"Authorization": `Bearer ${config.geniusAccessToken}`}})
				var j = await r.json()
				var songs = j.response.hits;
				if (songs.length < 1) {
					return msg.reply({ embed: new Discord.MessageEmbed()
						.setTitle("We can't find that!")
						.setAuthor("Genius Lyrics", "https://images.genius.com/f382a769534841745f6918c81cd66181.1000x1000x1.png")
						.setDescription(`We had **${songs.length}** results when we searched up **${args.join(" ")}**`)
						.setColor("#ff3860") });
				} else {
					var message = msg.reply({ embed: new Discord.MessageEmbed().setTitle(songs[0].result.full_title)
						.setDescription(`*Please wait...*`)
						.setURL(songs[0].result.url)
						.setAuthor("Genius Lyrics", "https://images.genius.com/f382a769534841745f6918c81cd66181.1000x1000x1.png")
						.setThumbnail(songs[0].result.header_image_url)
						.setColor("#3273dc"),
					}).then(m => {
						ly.song(songs[0].result.id, { fetchLyrics: true }).then(s => {
							let description = s.lyrics;
							if (description.length > 1500) {
								description = `${description.substring(0, 1500)} [(shortened, click for full lyrics)](${s.url})`;
							}

							m.edit({ embed: new Discord.MessageEmbed().setTitle(s.full_title)
								.setDescription(`${description}`)
								.setURL(s.url)
								.setAuthor("Genius Lyrics", "https://images.genius.com/f382a769534841745f6918c81cd66181.1000x1000x1.png")
								.setThumbnail(s.header_image_url)
								.setColor("#3273dc"),
							});
						});
					});
				}
			},
		},
	],
	events: [
		{
			name: "ready",
			exec: function(c) {
				ly = new lyr(config.geniusAccessToken)
			}
		}
	]
};
