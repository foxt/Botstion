var config = require("../config/config.json");
const Discord = require("discord.js");
module.exports = {
	name: "Evaluate Code",
	author: "SunburntRock89",
	version: 2,
	description: "Evaluates code from a message.",
	commands: [{
		name: "eval",
		usage: "console.log(\"Hello World!\")",
		description: "Executes some code.",
		execute: async(c, m, a) => {
			if (config.maintainers.includes(m.author.id)) {
				try {
					let result = eval(a.join(" ").replace("c.token", "").replace("client.token", "")
						.replace("[\"token\"]", ""));
					result = result.replace(config.token, "https://i.imgur.com/J7sAzzC.png");
					return m.reply(result);
				} catch (err) {
					return m.reply(`Woops, we had an error.\n\`\`\`${err}\`\`\``);
				}
			} else {
				m.reply({ embed: new Discord.MessageEmbed()
					.setAuthor("401: Access denied.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
					.setColor("#ff3860")
					.setFooter(`You do not have permissions to run this command. Sorry.`) });
			}
		},
	}],
	events: [],
	timer: [],
};
