const fs = require("fs");
const path = require("path");
const discord = require("discord.js");
require("./logger")
log("Botstion 4: A modular bot for Discord. Licenced under GPL 3.0 (see https://www.gnu.org/licenses/)")

require("./configUpdate")
const config = require("./configLoader")

const client = new discord.Client();
client.meta = {
	name: "Botstion 4",
	devs: ["theLMGN", "SunburntRock89"],
	git : "https://github.com/thelmgn/botstion",
}
//client.on("debug",console.log)

const plugins = [];

function scanFolder(folder) {
	var a = []
	var level = fs.readdirSync(folder)
	for (var file of level) {
		var j = path.join(folder, file)
		if (file.endsWith(".js")) {
			a.push(j)
		}
		if (fs.statSync(j).isDirectory()) {
			a = a.concat(scanFolder(j))
		}
	}
	return a

}

var pluginLoadEvent = new Promise(function(a,r) {
	var items = scanFolder("./plugins")

	log(`Read plugins folders and found ${items.length} plugins.`);
	for (var plugin of items) {
		log(`	Loading ${plugin}`);
		try {
			var pluginf = require("./" + plugin);
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
				log(`		Loaded ${pluginf.name} v${pluginf.version} by ${pluginf.author}`);
				plugins.push(pluginf);
			} else {
				log.error(`		Refusing to load ${pluginf.name} v${pluginf.version} by ${pluginf.author} because ${shouldLoad}`);
			}
			
		} catch(err) {
			log.error(`${plugin} experienced an error whilst loading`)
			log.error(err)
			log.error(`Skipping over ${plugin}..`)
		}
		
	}
	log("Adding addons.")
	for (var plugin of plugins) {
		if (plugin.addons) {
			for (var addon in plugin.addons) {
				log("	Adding addon " + addon + " from plugin " + plugin.name)
				client[addon] = plugin.addons[addon]
			}
		}
	}
	a(plugins)
})

client.on("ready", async () => {
	client.user.setPresence({ activity: { name: `Botstion is loading plugins...` }, status: "away" });
	log(`Connected to Discord.`);
	var plugins = await pluginLoadEvent
	client["plugins"] = plugins
	const commandhandler = require("./plugins/commandhandler");
	log(`Loaded commandhandler (${commandhandler.name} v${commandhandler.version})`);
	log(`Sending ${plugins.length} and client plugins to the commandhandler`);
	commandhandler.init(plugins, client);
	log("Assigining events");
	for (var plugin of plugins) {
		if (plugin.events) {
			for (var event of plugin.events) {
				log(`Giving ${plugin.name} the ${event.name} event`);
				client.on(event.name, event.exec);
				if (event.name == "ready") {
					event.exec(client)
				}
			}
		}
	}
	log("Setting up timer...");
	setInterval(() => {
		for (var plugin of plugins) {
			if (plugin.timer) {
				for (var timerHandler of plugin.timer) {
					timerHandler(client);
				}
			}
		};
	}, 10000);
	client.user.setPresence({ activity: { name: `Loaded ${plugins.length} plugins successfully!` }, status: "online" });
});

client.on("error", (e) => {
	log.error(e)
	process.exit(-1)
})

client.login(config.token);
