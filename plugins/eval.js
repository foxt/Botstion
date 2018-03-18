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
			try {
				let result = eval(a.join(" "));
				result = result.replace(config.token, "https://i.imgur.com/J7sAzzC.png");
				return m.reply(result);
			} catch (err) {
				return m.reply(`Woops, we had an error.\n\`\`\`${err}\`\`\``);
			}
		},
	}],
	events: [],
	timer: [],
};
