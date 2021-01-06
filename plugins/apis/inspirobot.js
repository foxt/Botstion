const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
	name: "Inspirobot",
	author: "theLMGN",
	version: 1,
	description: "Inspires you. (Ported from Botstion3)",
	commands: [
		{
			name: "inspirobot",
			description: "Inspires you.",
			category: "Fun",
			execute: async(c, m, a) => {
				var ftch = await fetch("http://inspirobot.me/api?generate=true")
				return m.reply({ embed: new Discord.MessageEmbed().setTitle("Inspirational Quote").setDescription(`I just cooked up a hot new inspirational quote`)
				.setColor("#3273dc")
				.setImage(await ftch.text())}) 
			}
		},
	]
};
