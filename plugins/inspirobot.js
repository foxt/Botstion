const Discord = require("discord.js");
const SNEK = require("snekfetch");


module.exports = {
	name: "Inspirobot",
	author: "theLMGN",
	version: 1,
	description: "Inspires you. (Ported from Botstion3)",
	commands: [
		{
			name: "inspirobot",
			usage: "",
			description: "Inspires you.",
			execute: async(c, m, a) => SNEK.get("http://inspirobot.me/api?generate=true").then(r => m.reply({ embed: new Discord.MessageEmbed().setTitle("Inspirational Quote*").setDescription(`I just cooked up a hot new inspirational quote*`)
				.setFooter("*Botstion or theLMGN do not claim that these quotes are actually insperational, or even make sense. In most cases, you should not follow the instructions in this quote. If you do not know if you should act upon this quote, seek a mental asylum, they'll help you :^).")
				.setColor("#3273dc")
				.setImage(r.body.toString()) })),
		},
	],
	events: [],
	timer: [],
};
