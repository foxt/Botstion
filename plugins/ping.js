const Discord = require("discord.js");

module.exports = {
	name: "Ping",
	author: "theLMGN",
	version: 4,
	description: "A simple ping command that replies pong.",
	commands: [
		{
			name: "ping",
			usage: "",
			description: "Pong!",
			execute: async(c, m, a) => m.reply({ embed: new Discord.MessageEmbed()
				.setAuthor("Pong!", "https://emojipedia-us.s3.amazonaws.com/thumbs/120/twitter/131/table-tennis-paddle-and-ball_1f3d3.png")
				.setColor("#e02343")
				.setFooter(`${c.ping ? Math.floor(c.ping) : Math.floor(c.ws.ping)}ms WS, ${new Date() - m.createdTimestamp}ms msg`) }),
		},
	]
};
