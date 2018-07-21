var allCommands = [];
var allPlugins = [];
var config = require("../config/config.json");
const Discord = require("discord.js");

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
				var emb = new Discord.MessageEmbed()
					.setTitle(`There are ${allCommands.length} available for you to use`)
					.setColor("#3273dc")
				var fields = 0;
				for (i in  allCommands) {
					var command = allCommands[i];
					if (fields > 24) {
						m.reply(emb)
						fields = 0
						emb = new Discord.MessageEmbed()
									.setTitle(`There are ${allCommands.length} commands available for you to use`)
									.setColor("#3273dc")
					}
					emb.addField(`${config.defaultPrefix}${command.name} ${command.usage}`, command.description, false);
				}
				m.reply(emb);

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
			var prefix = config.defaultPrefix; // todo: mongo prefix
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
