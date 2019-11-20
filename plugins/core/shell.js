const config = require("../../configLoader");
const Discord = require("discord.js");
const child_process_1 = require("child_process");
module.exports = {
	name: "ShellExec",
	author: "theLMGN",
	version: 1,
	description: "Runs process code from a message.",
	events: [{
		name: "message",
		exec: async m => {
            if (!m.content.startsWith("b$")) {
                return false
            }
			if (config.maintainers.includes(m.author.id)) {
				try {
					return child_process_1.exec(m.content.replace("b$",""), function (err, stdout) {
                        if (err) {return m.reply(`Woops, we had an error.\n\`\`\`${err}\`\`\``);}
                        return m.reply( "```bash\n" + stdout + "```");
                    });
				} catch (err) {
					return m.reply(`Woops, we had an error.\n\`\`\`${err}\`\`\``);
				}
			} else {
				m.reply({ embed: new Discord.MessageEmbed()
					.setAuthor("401: Access denied.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
					.setColor("#ff3860")
					.setFooter(`You do not have permissions to run this command. Sorry.`) });
			}
		},
	}]
};
