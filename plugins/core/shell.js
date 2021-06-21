const config = require("../../util/configLoader");
const Discord = require("discord.js");
const child_process_1 = require("child_process");
module.exports = {
    name: "ShellExec",
    author: "theLMGN",
    version: 1,
    description: "Runs process code from a message.",
    events: [{
        name: "message",
        exec: async (m) => {
            console.log(m);
            if (!m.content.startsWith("b$")) {
                return false;
            }
            if (config.maintainers.includes(m.author.id)) {
                try {
                    return child_process_1.exec(m.content.replace("b$", ""), (err, stdout, stderr) => {
                        let results = [];
                        if (err && err.toString().length > 0) {
                            err = err.toString();
                            if (err.length > 1990) {
                                results.push(new Discord.MessageEmbed().setTitle("Process error")
                                    .setFooter("Limited to first 1990 characters")
                                    .setDescription("```json\n" + err.substring(0, 1990) + "```")
                                    .setColor("#ff3860"), new Discord.MessageAttachment(Buffer.from(err), `error-${new Date()}.txt`));
                            } else {
                                results.push(new Discord.MessageEmbed().setTitle("Process error")
                                    .setDescription("```json\n" + err + "```")
                                    .setColor("#ff3860"));
                            }
                        }
                        if (stdout && stdout.toString().length > 0) {
                            stdout = stdout.toString();
                            if (stdout.length > 1990) {
                                results.push(new Discord.MessageEmbed().setTitle("Process stdout")
                                    .setFooter("Limited to first 1990 characters")
                                    .setDescription("```bash\n" + stdout.substring(0, 1990) + "```")
                                    .setColor("#47B353"), new Discord.MessageAttachment(Buffer.from(stdout), `stdout-${new Date()}.txt`));
                            } else {
                                results.push(new Discord.MessageEmbed().setTitle("Process stdout")
                                    .setDescription("```bash\n" + stdout + "```")
                                    .setColor("#47B353"));
                            }
                        }
                        if (stderr && stderr.toString().length > 0) {
                            stderr = stderr.toString();
                            if (stderr.length > 1990) {
                                results.push(new Discord.MessageEmbed().setTitle("Process stderr")
                                    .setFooter("Limited to first 1990 characters")
                                    .setDescription("```json\n" + stderr.substring(0, 1990) + "```")
                                    .setColor("#ff3860"), new Discord.MessageAttachment(Buffer.from(stderr), `stderr-${new Date()}.txt`));
                            } else {
                                results.push(new Discord.MessageEmbed().setTitle("Process stderr")
                                    .setDescription("```json\n" + stderr + "```")
                                    .setColor("#ff3860"));
                            }
                        }

                        m.reply(results);
                    });
                } catch (err) {
                    return m.reply(`Woops, we had an error.\n\`\`\`${err}\`\`\``);
                }
            } else {
                m.reply({ embed: new Discord.MessageEmbed()
                    .setAuthor("403: Access denied.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                    .setColor("#ff3860")
                    .setFooter("You do not have permissions to run this command. Sorry.") });
            }
        }
    }]
};
