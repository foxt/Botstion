const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require("../../../configLoader")

module.exports = {
	name: "SauceNAO",
	author: "theLMGN",
	version: 1,
	description: "Checks SauceNAO for image source.",
	commands: [
		{
			name: "sauce",
			usage: "https://example.org/example.png",
            description: "Checks SauceNAO for image source.",
            /**
             * @param c {Discord.Client}
             * @param m {Discord.Message}
             * @param a {Array}
             */
			execute: async(c, m, a) => {
                var allowNSFW = m.channel.nsfw || !m.channel.guild
                if (!allowNSFW) {
                    return m.reply({ embed: new Discord.MessageEmbed()
						.setAuthor("451: This command cannot be ran here!", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")
						.setFooter(`Due to the NSFW content that SauceNAO might return, this command cannot be ran here. Try again in DMs or in a NSFW channel.`) });
                }
                var ftch = await fetch("https://saucenao.com/search.php?numres=1&output_type=2" + (config.sourceNAOApiKey ? "&api_key=" + sourceNAOApiKey : "") + "&url=" + encodeURIComponent(a[0]))
                var j = await ftch.json()
                if (j.header.message) {
                    return m.reply({ embed: new Discord.MessageEmbed()
						.setAuthor(j.header.message, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")})
                } else {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setThumbnail(j.results[0].header.thumbnail)
                        .setURL(j.results[0].data.ext_urls[0])
                        .setTitle(j.results[0].header.index_name + " " + j.results[0].data.creator + " (" + j.results[0].header.similarity + "%)")
						.setColor("#3273dc")})
                }
            }
        }
	]
};
