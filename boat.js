
console.log("Botstion 4: A modular bot for Discord.\nCopyright (C) 2018 theLMGN\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\n(at your option) any later version.\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU General Public License for more details.\nYou should have received a copy of the GNU General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.")

const discord = require("discord.js");
const config = require("./config/config.json");
const client = new discord.Client();
const fs = require("fs");
const plugins = [];

client.on("ready", () => {
	client.user.setPresence({ activity: { name: `Botstion is loading plugins...` }, status: "away" });
	console.log(`Connected to Discord, loading plugins...`);
	fs.readdir("./plugins", async(err, items) => {
		if (err) {
			console.error("Failed to read plugins folder. Botstion will now exit.");
			process.exit(-2);
		} else {
			console.log(`Read plugins folder and found ${items.length} plugins.`);
			for (var plugin of items) {
				console.debug(`	Loading ${plugin}`);
				var pluginf = require(`./plugins/${plugin}`);
				var shouldLoad = false;
				if (pluginf.requiresConfig) {
					if (config[pluginf.requiresConfig]) {
						if (config[pluginf.requiresConfig] == "") {
							shouldLoad = false
						} else {
							shouldLoad = true
						}
					} else {
						shouldLoad = false
					}
				} else {
					shouldLoad = true
				}
				if (shouldLoad == true) {
					console.debug(`		Loaded ${pluginf.name} v${pluginf.version} by ${pluginf.author}`);
					plugins.push(pluginf);
				} else {
					console.error(`		Refusing to load ${pluginf.name} v${pluginf.version} by ${pluginf.author} because it requires the config value ${pluginf.requiresConfig}`);
				}

			}
			console.debug("Adding addons.")
			for (var plugin of plugins) {
				if (plugin.addons) {
					for (var addon in plugin.addons) {
						client[addon] = plugin.addons[addon]
					}
				}
			}
			const commandhandler = require("./plugins/commandhandler");
			console.log(`Loaded commandhandler (${commandhandler.name} v${commandhandler.version})`);
			console.debug(`Sending ${plugins.length} and client plugins to the commandhandler`);
			commandhandler.init(plugins, client);
			console.debug("Assigining events");
			for (var plugin of plugins) {
				for (var event of plugin.events) {
					console.debug(`Giving ${plugin.name} the ${event.name} event`);
					client.on(event.name, event.exec);
					if (event.name == "ready") {
						event.exec(client)
					}
				}
			}
			console.debug("Setting up timer...");
			setInterval(() => {
				for (var plugin of plugins) {
					for (var timerHandler of plugin.timer) {
						timerHandler(client);
					}
				};
			}, 10000);
			client.user.setPresence({ activity: { name: `Loaded ${plugins.length} plugins successfully!` }, status: "online" });
		}
	});
});

client.login(config.token);
