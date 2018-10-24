const Discord = require("discord.js");
const SNEK = require("snekfetch");


module.exports = {
	name: "XKCD",
	author: "theLMGN",
	version: 2,
	description: "Comics from XKCD",
	commands: [
		{
			name: "xkcd",
			usage: "(optional comic no.)",
			description: "Shows information of a XKCD comic.",
			execute: async(c, m, a) => {
				if (a.length >= 1) {
					a[0] = a[0] + "/"
				} else {
					a[0] = ""
				}

				SNEK.get(`https://xkcd.com/${a[0]}info.0.json`).then(r => {
					const comic = r.body
					m.reply({ embed: new Discord.MessageEmbed().setTitle(`Comic #${comic.num}: ${comic.title} (${comic.day}/${comic.month}/${comic.year})`)
					.setFooter(comic.alt)
					.setImage(comic.img)
					.setColor("#96A8C8")})
				})
			},
		},
	],
	events: [],
	timer: [],
};
