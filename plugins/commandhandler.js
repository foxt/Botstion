let allCommands = [];
let allPlugins = [];
const config = require("../util/configLoader");
const Discord = require("discord.js");
const argparser = require("../util/argparser");

async function handleError(e, msg) {
    if (e.handled) { return; }
    let stack = e.stack || e.toString();
    if (stack.length > 1950) {
        stack = stack.substr(0, 1950);
    }
    let emb = new Discord.MessageEmbed()
        .setAuthor("Oops. I had a unhandled error.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
        .setColor("#ff3860")
        .setDescription("<@" + msg.author.id + ">```" + stack + "```");
    try {
        (await msg.client.channels.fetch(config.errorReportChannel)).send({ embed: new Discord.MessageEmbed()
            .setAuthor("Oops. I had a unhandled error.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
            .setColor("#ff3860")
            .setDescription("```" + stack + "```")
            .setFooter(msg.content) });
        emb.setFooter("This server has been reported to the Botstion development team, and we may message you if we see fit.");
    } catch (e) { console.error(e); }
    e.handled = true;
    return msg.reply({ embed: emb });
}

function noop() { /**/ }

async function invokeCommand(command, msg, suffix, cmd) {
    if (msg.guild) {
        console.log(`${msg.author.username} invoked ${cmd} in ${msg.channel.guild.name} with arguments ${suffix.join(" ")}`);
    } else {
        console.log(`${msg.author.username} invoked ${cmd} with arguments ${suffix.join(" ")}`);
    }

    try {
        if (command.stipulations.nsfw >= 2) {
            let allowNSFW = msg.channel.nsfw || !msg.channel.guild;
            if (!allowNSFW) {
                return msg.reply({ embed: new Discord.MessageEmbed()
                    .setAuthor("451: This command cannot be ran here!", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                    .setColor("#ff3860")
                    .setFooter("Due to the NSFW content that this command may return, we have disabled it in non-NSFW channels. Try again in DMs or in a NSFW channel.") });
            }
        }
        if (command.stipulations.maintainer) {
            if (!config.maintainers.includes(msg.author.id)) {
                return msg.reply({ embed: new Discord.MessageEmbed()
                    .setAuthor("403: Access denied.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                    .setColor("#ff3860")
                    .setFooter("You must be a Botstion maintainer to run this command.") });
            }
        }
        if ((command.stipulations.context == 1 && !msg.channel.guild) || (command.stipulations.context == 2 && msg.channel.guild)) {
            return msg.reply({ embed: new Discord.MessageEmbed()
                .setAuthor("405: This command cannot be ran here", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                .setColor("#ff3860")
                .setFooter(`This command must be ran in ${command.stipulations.context == 1 ? "a server" : "direct messages"}.`) });
        }
        let parse = await argparser(suffix.join(" "), command.usage);
        if (parse[0]) {
            return msg.reply({ embed: new Discord.MessageEmbed()
                .setAuthor("400: " + parse[0], "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                .setColor("#ff3860")
                .setFooter("Usage: " + (command.rawUsage || "")) });
        }
        let rtrn = command.execute(msg.client, msg, parse[1]);
        if (rtrn.catch) {
            rtrn.catch((e) => {
                handleError(e, msg);
            });
        }
        rtrn = await rtrn;
        if (rtrn && typeof rtrn.react != "undefined") {
            try {
                rtrn.react("🗑️").then(noop).catch(noop);
                const filter = (reaction, user) => {
                    if (reaction.emoji.name === "🗑️" &&
						!user.bot &&
						(user.id == msg.author.id ||
							(!rtrn.guild ||
                            rtrn.guild.members.get(user.id).hasPermission("MANAGE_MESSAGES")))) {
                        rtrn.edit({ content: `(message was deleted by ${user.username})`, embed: null }).then(noop).catch(noop);
                        rtrn.reactions.removeAll().then(noop).catch(noop);
                    }
                };
                rtrn.awaitReactions(filter, { time: 15000 })
                    .then((collected) => {})
                    .catch(noop);
            } catch (e) {

            }
        } else {
            console.warn(`Command ${cmd} didn't return a Message object with arguments .`);
        }
    } catch (e) {
        handleError(e, msg);
    }
}

module.exports = {
    name: "Ganymede",
    author: "theLMGN",
    version: 3,
    description: "Botstion's commandhandler.",
    commands: [
        {
            name: "help",
            description: "Lists commands and their descriptions/examples",
            category: "Meta",
            usage: "bool optional legacy=false",
            execute: async(c, m, a) => {
                console.log(a);
                if (!a.legacy) {
                    return m.reply(new Discord.MessageEmbed()
                        .setDescription("The commands list has moved to [the website](https://bot.thelmgn.com/commands?hideMaintainer)")
                        .setFooter("However, you can still get the old documentation by using " + config.defaultPrefix + "help true")
                        .setColor("#3273dc"));
                }
                let emb = new Discord.MessageEmbed()
                    .setTitle(`There are ${allCommands.length} available for you to use`)
                    .setFooter("* = this argument is required")
                    .setColor("#3273dc");
                let fields = 0;
                for (i in allCommands) {
                    let command = allCommands[i];
                    if (fields > 24) {
                        try { m.author.send(emb); } catch (e) {}
                        fields = 0;
                        emb = new Discord.MessageEmbed()
                            .setTitle(`There are ${allCommands.length} commands available for you to use`)
                            .setColor("#3273dc");
                    }
                    emb.addField(`${config.defaultPrefix}${command.name} ${command.rawUsage || ""}`, `**Example: ${config.defaultPrefix}${command.name} ${command.usage.map((a) => a.default).join(" ")}**\n${command.description}`, false);
                }
                try {
                    m.author.send(emb);
                    try {
                        await m.react("📬");
                    } catch (e) {
                        await m.reply("📬 - Check your DMs!");
                    }
                } catch (e) {
                    await m.reply(`:mailbox: - Couldn't DM you.\n\`\`\`${e.toString()}\`\`\``);
                }
            }
        }
    ],
    events: [{
        name: "message",
        exec: async(msg) => {
            let prefix = config.defaultPrefix; // todo: mongo prefix
                                               // LUL
            if (msg.author.bot) return null;
            if (!msg.content.startsWith(prefix)) return null;
            const cmd = msg.content.split(" ")[0].trim().toLowerCase().replace(prefix, "");
            const suffix = msg.content.split(" ").splice(1);
            for (let command of allCommands) {
                if (cmd == command.name) {
                    invokeCommand(command, msg, suffix, cmd);
                    return true;
                }
                for (let alias of command.aliases || []) {
                    if (alias == cmd) {
                        await invokeCommand(command, msg, suffix, cmd);
                        return true;
                    }
                }
            }
        }
    }],
    init: async(plugins) => {
        for (let plugin of plugins) {
            allPlugins.push(plugin);
            if (plugin.commands) {
                for (let command of plugin.commands) {
                    command.rawUsage = command.usage;
                    command.stipulations = Object.assign({ nsfw: 0, perms: [], requiresPerms: [], maintainer: false, context: 0 }, command.stipulations || {});
                    command.usage = argparser.parseGrammar(command.usage || "");
                    allCommands.push(command);
                }
            }
        }
    },
    addons: { allCommands }
};
