const Discord = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
	name: "DDG Instant Answers",
	author: "theLMGN",
	version: 1,
	description: "DuckDuckGo instant answers",
	commands: [
		{
			name: "d",
			usage: "Discord",
			description: "DuckDuckGo instant answers",
			execute: async(c, m, a) => {
                var a = a.join(" ")
                var r = await fetch("https://api.duckduckgo.com/?format=json&atb=v131-1&q=" + encodeURIComponent(a))
                var j = await r.json()
                var embeds = []
                if (j.AbstractText.length > 1) {
                    embeds.push(new Discord.MessageEmbed()
                    .setTitle(j.Heading)
                    .setDescription(j.AbstractText)
                    .setThumbnail(j.Image)
                    .setURL(j.AbstractURL)
                    .setColor("#de5833"))
                }
                for (var topic of j.RelatedTopics) {
                    if (typeof topic.Topics == "undefined") {
                        var name = topic.FirstURL.replace("https://duckduckgo.com/","").replace(/_/g," ")
                        embeds.push(new Discord.MessageEmbed()
                        .setTitle(name)
                        .setDescription(topic.Text.replace(name,""))
                        .setThumbnail(topic.Icon.URL)
                        .setURL(topic.FirstURL)
                        .setColor("#de5833"))
                    }
                }
                c.paginate(m,embeds)
            }
        }
	]
};
