let allCommands = [];
let allPlugins = [];
const config = require("../util/configLoader");
const Discord = require("discord.js");
const argparser = require("../util/argparser");
/** @type {Discord.Client} */
const client = global.client;

const BotstionDiscordTypeMap = {
    word: "STRING",
    enum: "STRING",
    int: "INTEGER",
    float: "INTEGER",
    bool: "BOOLEAN",
    user: "USER"

};

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
        console.log(`${msg.author.username} invoked ${cmd} in ${msg.channel.guild.name} with arguments`, suffix);
    } else {
        console.log(`${msg.author.username} invoked ${cmd} with arguments`, suffix);
    }

    try {
        let rtrn = command.execute(msg.client, msg, suffix);
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
            name: "interaction",
            /**
             * @param {Discord.Interaction} interaction
             */
            exec: async (interaction) => {
                if (!interaction.isCommand()) return;
                console.log("[Callisto	] Recieved interaction", interaction);
                let cmd;
                for (let command of global.client.allCommands) {
                    if (interaction.commandName == command.name) {
                        cmd = command;
                    }
                    for (let alias of command.aliases || []) {
                        if (alias == interaction.commandName) {
                            cmd = command;
                        }
                    }
                }
                interaction.author = interaction.user;
                let opts = {};
                for (let opt of interaction.options.array()) {
                    opts[opt.name] = opt.user || (opt.member && opt.member.user) || opt.channel || opt.role || opt.value;
                }
                invokeCommand(cmd, interaction, opts, interaction.commandName);
            }
        },
        {
            name: "ready",
            exec: async () => {
                console.log("[Callisto	] Updating remote commands.");
                let clientCommands = {};
                client.allCommands.map((c) => {
                    let allowed = !c.stipulations.nsfw && !c.stipulations.maintainer && !c.stipulations.context && !c.stipulations.perms.length && !c.stipulations.requiresPerms.length && c.stipulations.slashCommands;
                    clientCommands[c.name] = {
                        name: c.name.toLowerCase(),
                        description: (allowed ? c.description : "Please run this command with `b!" + c.name + "`. It is currently not available as a slash command.").substr(0, 99),
                        defaultPermission: allowed,
                        options: c.usage.map((o) => {
                            let opt = {
                                type: BotstionDiscordTypeMap[o.type.kind],
                                name: o.name,
                                description: "Example: " + o.default || "The value for " + o.name,
                                required: !o.optional
                            };
                            if (o.type.allowedValues) opt.choices = o.type.allowedValues.map((e) => ({ name: e, value: e }));
                            return opt;
                        })
                    };
                });
                let commands = {};
                (await client.application.commands.fetch(undefined, { guildID: config.slashCommandTestGuild })).array().map((c) => { commands[c.name] = c; });
                console.log("[Callisto	]\t", Object.keys(commands).length, "commands retrieved.");
                let differingCommands = {};
                for (let command in commands) {
                    if (!clientCommands[command]) differingCommands[command] = commands[command];
                }
                for (let command in clientCommands) {
                    if (!commands[command] ||
                        clientCommands[command].description != commands[command].description ||
                        clientCommands[command].defaultPermission != commands[command].defaultPermission ||
                        JSON.stringify(clientCommands[command].options) != JSON.stringify(commands[command].options)) {
                        differingCommands[command] = clientCommands[command];
                        if (!commands[command]) continue;
                        if (clientCommands[command].description != commands[command].description) console.log("[Callisto	]\t\t", command, "'s description differs");
                        if (clientCommands[command].defaultPermission != commands[command].defaultPermission) console.log("[Callisto	]\t\t", command, "'s permission differs");
                        if (JSON.stringify(clientCommands[command].options) != JSON.stringify(commands[command].options)) console.log("[Callisto	]\t\t", command, "'s options differs", JSON.stringify(clientCommands[command].options), JSON.stringify(commands[command].options));
                    }
                }
                console.log("[Callisto	]\t", Object.keys(differingCommands).length, "commands differ.");
                for (let command in differingCommands) {
                    let remcmd = commands[command];
                    let clicmd = clientCommands[command];
                    try {
                        if (remcmd && !clicmd) {
                            console.log("[Callisto	]\t\tDeleting command", remcmd.name);
                            await client.application.commands.delete(remcmd, config.slashCommandTestGuild);
                        } else if (!remcmd && clicmd) {
                            console.log("[Callisto	]\t\tUploading command", clicmd.name);
                            await client.application.commands.create(clicmd, config.slashCommandTestGuild);
                        } else {
                            console.log("[Callisto	]\t\tEditing command", remcmd.name);
                            await client.application.commands.edit(remcmd, clicmd, config.slashCommandTestGuild);
                        }
                    } catch (e) {
                        console.error("[Callisto	]\t\tCouldn't update command", (remcmd || clicmd).name, remcmd || clicmd, e);
                    }
                }

                console.log("[Callisto	]\tDone updating remote commands.");
            }
        }],
    addons: { allCommands }
};
