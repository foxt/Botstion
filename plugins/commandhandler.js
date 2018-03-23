var allCommands = [];
var allPlugins = [];
var config = require("../config/config.json");

module.exports = {
	name: "Ganymede",
	author: "theLMGN",
	version: 3,
	description: "Botstion's commandhandler.",
	commands: [
		{
			name: "help",
			usage: "",
			description: "Lists commands and their descriptions/examples",
			execute: async(c, m, a) => {
				var commandString = "";
				allCommands.forEach(cmd => {
					if (commandString.length > 1750) {
						m.reply(commandString);
						commandString = "";
					}
					commandString = `${commandString}\n\n -- ${cmd.name} --\nExample: b!${cmd.name} ${cmd.usage}\n${cmd.description} \n`;
				});
				m.reply(commandString);
				commandString = "";
			},
		},
		{
			name: "plugins",
			usage: "",
			description: "Lists plugins.",
			execute: async(c, m, a) => {
				var pluginsString = "";
				allPlugins.forEach(p => {
					if (pluginsString.length > 1500) {
						m.reply(pluginsString);
						pluginsString = "";
					}
					pluginsString = `${pluginsString}\n\n -- ${p.name} v${p.version} --\nAuthor: ${p.author}\n${p.commands.length} commands, ${p.events.length} event handlers and ${p.timer.length} timer handlers\n${p.description}\n`;
				});
				m.reply(pluginsString);
				pluginsString = "";
			},
		},
	],
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
			allPlugins.push(plugin);
			plugin.commands.forEach(command => {
				allCommands.push(command);
			});
		});
	},
};
