const config = require("../../configLoader");
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
					let result = await eval(`(async function() {return ${a.join(" ").replace("c.token", "").replace("client.token", "").replace("[\"token\"]", "")}})()`);
					var str = JSON.stringify(result)
					console.log(result,str)
					if (result && !str) {
						if (typeof result.toString == "function") {
							str = result.toString()
						} else {
							str = "*I have no idea what to do with this " + typeof result + "*"
						}
					}
					if (!result) {
						result = "undefined"
					}
					str = str.replace(eval(`/${config.token}/g`), "no");
					return m.reply(str);
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
	}]
};
