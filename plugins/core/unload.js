const Discord = require("discord.js");
const e = require("express");
const config = require("../../configLoader");

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key].exports === value);
  }

async function unloadPluginCommand(c,m,a) {
    var name = a.pluginName.join(" ").toLowerCase()
    var plugins =  global.client.plugins.filter((n) => n.name.toLowerCase().includes(name))
    if (plugins.length > 1) {
        return m.reply({ embed: new Discord.MessageEmbed()
            .setAuthor("Ambiguous search", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
            .setDescription(plugins.map((p) => p.name.toLowerCase().replace(name,"**" +name + "**")).join("\n"))
            .setColor("#ff3860")
            .setFooter(`You need to be more specific.`)});
    }
    if (plugins.length < 1) {
        return m.reply({ embed: new Discord.MessageEmbed()
            .setAuthor("Plugin not found", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
            .setColor("#ff3860")
            .setFooter(`You need to be less specific.`)});
    }
    var plugin = plugins[0]
    console.log("Unloading",plugin)
    var r = await m.reply("Attempting to unload",[new Discord.MessageEmbed()
        .setAuthor(plugin.author)
        .setTitle(plugin.name)
        .setDescription(plugin.description)
        .addField("Version",plugin.version)
        .setColor("#ffdd57")]);

    if (plugin.addons) {
        for (var addon in plugin.addons) {
            console.log("Removing addon " + addon + " from plugin " + plugin.name)
            plugin.addons[addon] = undefined
            client[addon] = undefined
        }
    }
    if (plugin.timer) {
        plugin.timer = function(){}
    }
    if (plugin.events) {
        for (var event of plugin.events) {
            console.log(`Taking away ${plugin.name} the ${event.name} event`);
            event.exec = function(){}
        }
    }
    if (plugin.commands) {
        for (var command of plugin.commands) {
            var idx
            idx = client.allCommands.indexOf(command)
            while (idx > -1) {
                console.log("Removing command " + command.name + " from plugin " + plugin.name)    
                client.allCommands.splice(idx,1)
                idx = client.allCommands.indexOf(command)
            }
            command.execute = function(){}
        }
    }
    var idx
    idx = client.plugins.indexOf(plugin)
    while (idx > -1) {
        console.log("Removing plugin " + plugin.name)    
        client.plugins.splice(idx,1)
        idx = client.plugins.indexOf(plugin)
    }
    command.execute = function(){}
    var k = getKeyByValue(require.cache,plugin)
    r.edit("Attempting to unload, stored at `" + k + "`",[new Discord.MessageEmbed()
        .setAuthor(plugin.author)
        .setTitle(plugin.name)
        .setDescription(plugin.description)
        .addField("Version",plugin.version)
        .setColor("#ffdd57")]);
    delete require.cache[k]
    r.edit(`Module \`${k}\` (mostly) unloaded!`,[new Discord.MessageEmbed()
        .setAuthor(plugin.author)
        .setTitle(plugin.name)
        .setDescription(plugin.description)
        .addField("Version",plugin.version)
        .setColor("#23d160")]);
    return k
}
async function loadPluginCommand(c,m,a) {
    
    var plugin = a.path.join(" ")
    console.log(`	Loading ${plugin}`);
    var pluginf;
    try {
        pluginf = require(plugin);
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
        if (client.plugins.includes(pluginf)) {
            shouldLoad= "it's already loaded"
        }
        if (shouldLoad == true) {
            console.log(`		Loaded ${pluginf.name} v${pluginf.version} by ${pluginf.author}`);
            client.plugins.push(pluginf);
        } else {
            console.error(`		Refusing to load ${pluginf.name} v${pluginf.version} by ${pluginf.author} because ${shouldLoad}`);
            return m.reply({ embed: new Discord.MessageEmbed()
                .setAuthor("500: Will not load plugin.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                .setColor("#ff3860")
                .setDescription(`Refusing to load ${pluginf.name} v${pluginf.version} by ${pluginf.author} because ${shouldLoad}`) });
        }
        
    } catch(err) {
        console.error(err)
        return m.reply({ embed: new Discord.MessageEmbed()
            .setAuthor("500: Couldn't load plugin.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
            .setColor("#ff3860")
            .setDescription(err.trace || err.toString()) });
    }
    var plugin = pluginf;
    if (plugin.addons) {
        for (var addon in plugin.addons) {
            console.log("	Adding addon " + addon + " from plugin " + plugin.name)
            client[addon] = plugin.addons[addon]
        }
    }
    if (plugin.events) {
        for (var event of plugin.events) {
            console.log(`Giving ${plugin.name} the ${event.name} event`);
            client.on(event.name, event.exec);
            if (event.name == "ready") {
                event.exec(client)
            }
        }
    }
    require("../commandhandler").init([plugin])
    return m.reply("Plugin loaded!",[new Discord.MessageEmbed()
        .setAuthor(plugin.author)
        .setTitle(plugin.name)
        .setDescription(plugin.description)
        .addField("Version",plugin.version)
        .setColor("#23d160")]);
}


module.exports = {
	name: "Plugin Manager",
	author: "theLMGN",
	version: 1,
	description: "Allows you to unload plugins",
	commands: [{
		name: "unload",
        description: "Unload a plugin",
        usage: "word[] pluginName=\"plugin unloader\"",
        stipulations: {
			maintainer: true
		},
		execute: unloadPluginCommand
    },
    {
		name: "load",
        description: "Load a plugin",
        usage: "word[] path=\"./unload.js\"",
        stipulations: {
			maintainer: true
		},
		execute: loadPluginCommand
    },
    {
		name: "reload",
        description: "Reload a plugin",
        usage: "word[] pluginName=\"plugin unloader\"",
        stipulations: {
			maintainer: true
		},
		execute: async(c, m, a) => {
            var b =await unloadPluginCommand(c,m,a)
            return await loadPluginCommand(c,m,{path:[b]})
		},
	}]
};
