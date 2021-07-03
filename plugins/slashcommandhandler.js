let allCommands = [];
let allPlugins = [];
const config = require("../util/configLoader");
const Discord = require("discord.js");
const argparser = require("../util/argparser");
/** @type {Discord.Client} */
const client = global.client;

async function handleError(e, msg) {
    if (e.handled) { return; }
    let stack = e.stack || e.toString();
    if (stack.length > 1950) {
        stack = stack.substr(0, 1950);
    }
    try {
        (await msg.client.channels.fetch(config.errorReportChannel)).send({ embed: new Discord.MessageEmbed()
            .setAuthor("Oops. I had a unhandled error.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
            .setColor("#ff3860")
            .setDescription("```" + stack + "```")
            .setFooter(msg.content) });
    } catch (err) { console.error("[Callisto	]", e); }
    e.handled = true;
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
        if (rtrn && rtrn.catch) {
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
                    .then(() => { /**/ })
                    .catch(noop);
            } catch (e) {

            }
        } else {
            console.warn(`[Callisto	] Command ${cmd} didn't return a Message object with arguments .`);
        }
    } catch (e) {
        handleError(e, msg);
    }
}

module.exports = {
    name: "Callisto",
    author: "theLMGN",
    version: 1,
    description: "Botstion slash command handler. Intended for use *along side* Ganymede.",
    events: [
        {
            name: "ready",
            exec: async () => {
                console.log("[Callisto	] Updating remote commands.");
                /** @type Discord.Collection<Discord.Snowflake, Discord.ApplicationCommand> */
                let commands = await client.application.commands.fetch(undefined, { guildID: config.slashCommandTestGuild });
                console.log("[Callisto	]\t", commands.array().length, "commands retrieved.");
                console.log("[Callisto	] Done updating remote commands.");
            }
        }],
    addons: { allCommands }
};
