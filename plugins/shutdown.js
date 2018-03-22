const Discord = require("discord.js");
var config = require("../config/config.json");

module.exports = {
	name: "Shutdown",
	author: "theLMGN",
	version: 1,
	description: "Destroys the client then kills the process. (Ported from Botstion3)",
	commands: [{
		name: "shutdown",
		usage: "",
		description: "Shutdown the bot.",
		execute: async(c, m, a) => {
			if (config.maintainers.includes(m.author.id)) {
				await m.reply({ embed: new Discord.MessageEmbed()
					.setTitle("See ya!")
					.setDescription("Botstion is about to go down.")
					.setColor("#23d160") });
				c.destroy().then(() => process.exit());
			} else {
				m.reply({ embed: new Discord.MessageEmbed()
					.setAuthor("401: Access denied.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
					.setColor("#ff3860")
					.setFooter(`You do not have permissions to run this command. Sorry.`) });
			}
		},
	}],
	events: [],
	timer: [],
};
