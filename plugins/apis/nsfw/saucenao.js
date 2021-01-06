const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require("../../../util/configLoader")

module.exports = {
	name: "SauceNAO",
	author: "theLMGN",
	version: 1,
	description: "Checks SauceNAO for image source.",
	commands: [
		{
			name: "sauce",
			usage: "word url=https://example.org/example.png",
            description: "Checks SauceNAO for image source.",
            category: "NSFW",
            stipulations: {
                nsfw: 2,
            },
            /**
             * @param c {Discord.Client}
             * @param m {Discord.Message}
             * @param a {Array}
             */
			execute: async(c, m, a) => {

                var ftch = await fetch("https://saucenao.com/search.php?output_type=2" + (config.sourceNAOApiKey ? "&api_key=" + config.sourceNAOApiKey  : "") + "&url=" + encodeURIComponent(a.url))
                var j = await ftch.json()
                if (j.header.message) {
                    return m.reply({ embed: new Discord.MessageEmbed()
						.setAuthor(j.header.message, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
						.setColor("#ff3860")})
                } else {
                    var embeds = []
                    for (var r of j.results) {
                        var e = new Discord.MessageEmbed()
                        .setThumbnail(r.header.thumbnail)
                        .setDescription("**URLs:**\n"+ (r.data.ext_urls || []).join("\n"))
                        .setTitle(r.header.index_name + " " + (r.data.creator || "")+ " (" + r.header.similarity + "%)")
                        .setColor("#3273dc")
                        if (r.data.source) {
                            e.addField("Source",r.data.source)
                        }
                        embeds.push(e)
                    }
                    if (embeds.length > 1) {
                        c.paginate(m,embeds)
                    } else if (embeds.length == 1) {
                        return m.reply(embeds[0])
                    } else {
                        return m.reply(new Discord.MessageEmbed()
                        .setTitle("No results")
                        .setColor("#ff3860"))
                    }
                }
            }
        }
	]
};
