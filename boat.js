const discord = require("discord.js");
const config = require("./config/config.json");
const client = new discord.Client();
const fs = require("fs");
const plugins = [];

client.on("ready", () => {
	console.log(`Connected to Discord, loading plugins...`);
	fs.readdir("./plugins", async(err, items) => {
		if (err) {
			console.err("Failed to read plugins folder. Botstion will now exit.");
			process.exit(-2);
		} else {
			console.log(`Read plugins folder and found ${items.length} plugins.`);
			items.forEach(plugin => {
				console.debug(`	Loading ${plugin}`);
				var pluginf = require(`./plugins/${plugin}`);
				console.debug(`		Loaded ${pluginf.name} v${pluginf.version} by ${pluginf.author}`);
				plugins.push(pluginf);
			});
			const commandhandler = require("./plugins/commandhandler");
			console.log(`Loaded commandhandler (${commandhandler.name} v${commandhandler.version})`);
			console.debug(`Sending ${plugins.length} and client plugins to the commandhandler`);
			commandhandler.init(plugins, client);
			console.debug("Assigining events");
			plugins.forEach(plugin => {
				plugin.events.forEach(event => {
					console.debug(`Giving ${plugin.name} the ${event.name} event`);
					client.on(event.name, event.exec);
				});
			});
			console.debug("Setting up timer...");
			setInterval(() => {
				plugins.forEach(plugin => {
					plugin.timer.forEach(timerHandler => {
						timerHandler(client);
					});
				});
			}, 10000);
		}
	});
});

client.on("message", async msg => {
	console.log(msg);
});

client.login(config.token);
