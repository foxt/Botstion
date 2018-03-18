var config = require("../config/config.json");
const Discord = require("discord.js");
module.exports = {
	name: "Evaluate Code",
	author: "theLMGN",
	version: 1,
	description: "Evaluates code from a message.",
	commands: [{
		name: "eval",
		usage: "console.log(\"Hello World!\")",
		description: "Executes some code.",
		execute: async(c, m, a) => {
			try {
				m.reply(`\`\`\`${new Function("c", "m", a.join(" ").replace("c.token", " 'nice try xd'"))(c, m).toString().replace(c.token, "fuck off.")}\`\`\``);
			} catch (err) {
				return m.reply(`Woops, we had an error.\n\`\`\`${err}\`\`\``);
			}
		},
	}],
	events: [],
	timer: [],
};
