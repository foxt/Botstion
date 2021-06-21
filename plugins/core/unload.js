const Discord = require("discord.js");
const e = require("express");
const config = require("../../util/configLoader");
const noop = () => { /**/ };

function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key].exports === value);
}

async function unloadPluginCommand(c, m, a) {
    let name = a.pluginName.join(" ").toLowerCase();
    let plugins = global.client.plugins.filter((n) => n.name.toLowerCase().includes(name));
    if (plugins.length > 1) {
        return m.reply({ embed: new Discord.MessageEmbed()
            .setAuthor("Ambiguous search", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
            .setDescription(plugins.map((p) => p.name.toLowerCase().replace(name, "**" + name + "**")).join("\n"))
            .setColor("#ff3860")
            .setFooter("You need to be more specific.") });
    }
    if (plugins.length < 1) {
        return m.reply({ embed: new Discord.MessageEmbed()
            .setAuthor("Plugin not found", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
            .setColor("#ff3860")
            .setFooter("You need to be less specific.") });
    }
    let plugin = plugins[0];
    console.log("Unloading", plugin);
    let r = await m.reply("Attempting to unload", [new Discord.MessageEmbed()
        .setAuthor(plugin.author)
        .setTitle(plugin.name)
        .setDescription(plugin.description)
        .addField("Version", plugin.version)
        .setColor("#ffdd57")]);

    if (plugin.addons) {
        for (let addon in plugin.addons) {
            console.log("Removing addon " + addon + " from plugin " + plugin.name);
            plugin.addons[addon] = undefined;
            global.client[addon] = undefined;
        }
    }
    if (plugin.timer) {
        plugin.timer = noop;
    }
    if (plugin.events) {
        for (let event of plugin.events) {
            console.log(`Taking away ${plugin.name} the ${event.name} event`);
            event.exec = noop;
        }
    }
    if (plugin.commands) {
        for (let command of plugin.commands) {
            let idx;
            idx = global.client.allCommands.indexOf(command);
            while (idx > -1) {
                console.log("Removing command " + command.name + " from plugin " + plugin.name);
                global.client.allCommands.splice(idx, 1);
                idx = global.client.allCommands.indexOf(command);
            }
            command.execute = noop;
        }
    }
    let idx = global.client.plugins.indexOf(plugin);
    while (idx > -1) {
        console.log("Removing plugin " + plugin.name);
        global.client.plugins.splice(idx, 1);
        idx = global.client.plugins.indexOf(plugin);
    }
    let k = getKeyByValue(require.cache, plugin);
    r.edit("Attempting to unload, stored at `" + k + "`", [new Discord.MessageEmbed()
        .setAuthor(plugin.author)
        .setTitle(plugin.name)
        .setDescription(plugin.description)
        .addField("Version", plugin.version)
        .setColor("#ffdd57")]);
    delete require.cache[k];
    r.edit(`Module \`${k}\` (mostly) unloaded!`, [new Discord.MessageEmbed()
        .setAuthor(plugin.author)
        .setTitle(plugin.name)
        .setDescription(plugin.description)
        .addField("Version", plugin.version)
        .setColor("#23d160")]);
    return k;
}
async function loadPluginCommand(c, m, a) {
    let plugin = a.path.join(" ");

    return m.reply("Plugin loaded!", [new Discord.MessageEmbed()
        .setAuthor(plugin.author)
        .setTitle(plugin.name)
        .setDescription(plugin.description)
        .addField("Version", plugin.version)
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
        category: "Meta",
        execute: unloadPluginCommand
    },
    {
        name: "load",
        description: "Load a plugin",
        usage: "word[] path=\"./unload.js\"",
        stipulations: {
            maintainer: true
        },
        category: "Meta",
        execute: loadPluginCommand
    },
    {
        name: "reload",
        description: "Reload a plugin",
        usage: "word[] pluginName=\"plugin unloader\"",
        stipulations: {
            maintainer: true
        },
        category: "Meta",
        execute: async (c, m, a) => {
            let b = await unloadPluginCommand(c, m, a);
            return loadPluginCommand(c, m, { path: [b] });
        }
    }]
};
