const fs = require("fs");
console.log("Botstion 4: A modular bot for Discord. Licenced under GPL 3.0 (see https://www.gnu.org/licenses/)")

require("./configUpdate")

const discord = require("discord.js");
let config = []
if(fs.existsSync("./config/config.js")) {
	config = require("./config/config.js")
} else if(fs.existsSync("./config/defaultConfig.js")){
	config = require("./config/defaultConfig.js")
} else {
	console.log("No configurations found (tried defaultConfig.js and config.js), terminating!")
	process.exit(1);
}

for(var key in Object.keys(config)){
	if(key in process.env){
		config[key] = process.env[key]
		console.log("Found " + key + " from environment variable - overriding config!")
	}
}

const client = new discord.Client();

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
							shouldLoad = `it requires the config value ${pluginf.requiresConfig}`
						} else {
							shouldLoad = true
						}
					} else {
						shouldLoad = `it requires the config value ${pluginf.requiresConfig}`
					}
				} else {
					shouldLoad = true
				}
				if (pluginf.disable) {
					shouldLoad = "it's disabled"
				}
				if (shouldLoad == true) {
					console.debug(`		Loaded ${pluginf.name} v${pluginf.version} by ${pluginf.author}`);
					plugins.push(pluginf);
				} else {
					console.error(`		Refusing to load ${pluginf.name} v${pluginf.version} by ${pluginf.author} because ${shouldLoad}`);
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
