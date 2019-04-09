const Discord = require("discord.js");
const {get} = require("snekfetch");
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
                get("https://api.duckduckgo.com/?format=json&pretty=1&atb=v131-1&q=" + encodeURIComponent(a)).send().then(async function(r) {
                    var j = JSON.parse(r.body)
                    console.log(j)
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
                    console.log(embeds)
                    c.paginate(m,embeds)
                })
            }
        }
	],
	events: [],
	timer: [],
};
