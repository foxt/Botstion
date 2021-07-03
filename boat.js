const fs = require("fs");
const path = require("path");
const discord = require("discord.js");
console.log("[Core		] Botstion 4: A modular bot for Discord. Licenced under GPL 3.0 (see https://www.gnu.org/licenses/)");

const config = require("./util/configLoader");
const { loadPlugin } = require("./util/pluginloader");

class MessageClassWhereTheReplyFunctionIsntCompletelyFuckedInAWayThatMakesItMoreTediousToWriteThanThisClassName extends discord.Message {
    reply(options) {
        if (options instanceof discord.MessageEmbed) options = { embeds: [options] };
        if (options instanceof discord.MessageAttachment) options = { files: [options] };
        if (options.embed) options.embeds = [options.embed];
        super.reply(options);
    }
}
discord.Structures.extend("Message", () => MessageClassWhereTheReplyFunctionIsntCompletelyFuckedInAWayThatMakesItMoreTediousToWriteThanThisClassName);
class NewInteraction extends discord.CommandInteraction {
    reply(options) {
        if (options instanceof discord.MessageEmbed) options = { embeds: [options] };
        if (options instanceof discord.MessageAttachment) options = { files: [options] };
        if (options.embed) options.embeds = [options.embed];
        super.reply(options);
    }
}
discord.Structures.extend("CommandInteraction", () => NewInteraction);

const client = new discord.Client({ autoReconnect: true, intents: discord.Intents.NON_PRIVILEGED, partials: ["CHANNEL"] });
global.client = client;
client.meta = {
    name: "Botstion 4",
    devs: ["theLMGN", "SunburntRock89"],
    git: "https://github.com/thelmgn/botstion"
};
// client.on("debug",console.log)

const plugins = [];
client.plugins = plugins;
client.config = config;

function scanFolder(folder) {
    let a = [];
    let level = fs.readdirSync(folder);
    for (let file of level) {
        let j = path.join(folder, file);
        if (file.endsWith(".js")) {
            a.push(j);
        }
        if (fs.statSync(j).isDirectory()) {
            a = a.concat(scanFolder(j));
        }
    }
    return a;
}

let pluginLoadEvent = new Promise((a) => {
    let items = scanFolder("./plugins");

    console.log(`[Core		] Read plugins folders and found ${items.length} plugins.`);
    for (const plugin of items) {
        try {
            loadPlugin(path.resolve(plugin));
        } catch (err) {
            console.error(`[Core		] ${plugin} experienced an error whilst loading`);
            console.error("[Core		]", err);
            console.error(`[Core		] Skipping over ${plugin}..`);
        }
    }
    a();
});

client.on("ready", async () => {
    client.user.setPresence({ activity: { name: "Botstion is loading plugins..." }, status: "away" });
    console.log("[Core		] Connected to Discord.");
    await pluginLoadEvent;
    const commandhandler = require("./plugins/commandhandler");
    console.log(`[Core		] Loaded commandhandler (${commandhandler.name} v${commandhandler.version})`);
    console.log(`[Core		] Sending ${client.plugins.length} and client plugins to the commandhandler`);
    commandhandler.init(client.plugins, client);
    console.log("[Core		] Firing ready events");
    for (let plugin of plugins) {
        if (plugin.events) {
            for (let event of plugin.events) {
                if (event.name == "ready" && !event.fired) {
                    console.log("[Core		]     Firing ready event for: " + plugin.name);
                    event.fired = true;
                    event.exec(client);
                }
            }
        }
    }


    client.user.setPresence({ activity: { name: `Loaded ${client.plugins.length} plugins successfully!` }, status: "online" });
});
setInterval(() => {
    for (let plugin of client.plugins) {
        if (plugin.timer) {
            for (let timerHandler of plugin.timer) {
                timerHandler(client);
            }
        }
    }
}, 10000);

process.setUncaughtExceptionCaptureCallback(async (e) => {
    console.error("[Proc		]", e);
    try {
        let stack = e.stack || e.toString();
        if (stack.length > 1950) {
            stack = stack.substr(0, 1950);
        }
        (await client.channels.fetch(config.errorReportChannel)).send({ embeds: [new discord.MessageEmbed()
            .setAuthor("Uncaught exception, somewhere!", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
            .setColor("#ff3860")
            .setDescription("```" + stack + "```")] });
    } catch (er) { console.error("[Core		]", er); }
});
client.on("error", async (e) => {
    console.error("[Client		]", e);
    try {
        let stack = e.stack || e.toString();
        if (stack.length > 1950) {
            stack = stack.substr(0, 1950);
        }
        (await client.channels.fetch(config.errorReportChannel)).send({ embeds: [new discord.MessageEmbed()
            .setAuthor("Client error, somewhere!", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
            .setColor("#ff3860")
            .setDescription("```" + stack + "```")] });
    } catch (er) { console.error("[Core		]", er); }
    process.exit(-1);
});

client.login(config.token);
