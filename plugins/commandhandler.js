var allCommands = [];
var config = require("../config/config.json");

module.exports = {
	name: "Ganymede",
	author: "theLMGN",
	version: 3,
	description: "Botstion's commandhandler.",
	commands: [],
	events: [{
		name: "message",
		exec: async msg => {
			console.log("message");
			var prefix = "b!"; // todo: mongo prefix
			if (msg.author.bot) return null;
			if (!msg.content.startsWith(prefix)) return null;
			const cmd = msg.content.split(" ")[0].trim().toLowerCase().replace(prefix, "");
			const suffix = msg.content.split(" ").splice(1);
			allCommands.forEach(command => {
				if (cmd == command.name) {
					if (msg.guild) {
						console.log(`${msg.author.username} invoked ${cmd} in ${msg.channel.guild.name}`);
					} else {
						console.log(`${msg.author.username} invoked ${cmd}`);
					}
					command.execute(msg.client, msg, suffix);
				}
			});
		},
	}],
	timer: [],
	init: async plugins => {
		plugins.forEach(plugin => {
			plugin.commands.forEach(command => {
				allCommands.push(command);
			});
		});
	},
};
