const Discord = require("discord.js");
const shortcuts = require("shortcuts.js");


module.exports = {
    name: "Apple Shortcuts",
    author: "theLMGN",
    version: 1,
    description: "Data on Apple iOS Shortcuts",
    commands: [
        {
            name: "shortcuts",
            usage: "word shortcut_url=https://www.icloud.com/shortcuts/5e8f36990cec481db78872ed70b3dcc8",
            description: "Data on Apple iOS Shortcuts",
            category: "Utilities",
            execute: async (c, m, a) => {
                let e = await m.reply({ embed: new Discord.MessageEmbed()
                    .setTitle("Working...")
                    .setDescription("Please wait a few seconds")
                    .setColor("#ffdd57") });
                let input = a.shortcut_url;
                let id = shortcuts.idFromURL(input);
                if (input.length == 32) {
                    id = input;
                }
                if (id) {
                    let shortcut = await shortcuts.getShortcutDetails(id);
                    let metadata = await shortcut.getMetadata();
                    let output = "";
                    if (metadata.importQuestions.length > 0) {
                        output += `**Import questions (${metadata.importQuestions.length}):**`;
                        for (let importQuestion of metadata.importQuestions) {
                            output += `\n${importQuestion.text}: \`${importQuestion.defaultValue}\``;
                        }
                    }
                    if (metadata.importQuestions.length > 0 && metadata.actions.length > 0) {
                        output += "\n\n\n";
                    }
                    if (metadata.actions.length > 0) {
                        output += `**Actions (beta) (${metadata.actions.length}):**`;
                        for (let action of metadata.actions) {
                            if (output.length < 1900) {
                                if (JSON.stringify(action.parameters) == "{}") {
                                    output = output + "\n**" + action.identifier + "**";
                                } else {
                                    output = output + "\n**" + action.identifier + "**: ```json\n" + JSON.stringify(action.parameters) + "```";
                                }
                            }
                        }
                    }
                    if (output.length > 1750) {
                        output += "(output may of been truncated)";
                    }
                    return e.edit({ embed: new Discord.MessageEmbed()
                        .setTitle(shortcut.name)
                        .setColor("#" + shortcut.icon.color.toString(16).substring(0, 6))
                        .setURL("https://www.icloud.com/shortcuts/" + shortcut.id)
                        .setDescription(output)
                        .setFooter("Shortcut last updated " + shortcut.modificationDate.toString()) });
                } else {
                    return e.edit({ embed: new Discord.MessageEmbed()
                        .setAuthor("415: Failed to parse", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860")
                        .setFooter("This command only accepts 1 argument, the shortcut URL.") });
                }
            }
        }
    ]
};
