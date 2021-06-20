const Discord = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
    name: "DDG Instant Answers",
    author: "theLMGN",
    version: 1,
    description: "DuckDuckGo instant answers",
    disabled: true,
    commands: [
        {
            name: "d",
            usage: "word[] searchQuery=Discord",
            description: "DuckDuckGo instant answers",
            category: "Utilities",
            execute: async(c, m, a) => {
                var a = a.searchQuery;
                let r = await fetch("https://api.duckduckgo.com/?format=json&atb=v131-1&q=" + encodeURIComponent(a));
                let j = await r.json();
                let embeds = [];
                if (j.AbstractText.length > 1) {
                    embeds.push(new Discord.MessageEmbed()
                        .setTitle(j.Heading)
                        .setDescription(j.AbstractText)
                        .setThumbnail(j.Image)
                        .setURL(j.AbstractURL)
                        .setColor("#de5833"));
                }
                for (let topic of j.RelatedTopics) {
                    if (typeof topic.Topics == "undefined") {
                        let name = topic.FirstURL.replace("https://duckduckgo.com/", "").replace(/_/g, " ");
                        embeds.push(new Discord.MessageEmbed()
                            .setTitle(name)
                            .setDescription(topic.Text.replace(name, ""))
                            .setThumbnail(topic.Icon.URL)
                            .setURL(topic.FirstURL)
                            .setColor("#de5833"));
                    }
                }
                if (embeds.length < 1) {
                    return m.reply("No results.");
                }
                c.paginate(m, embeds);
            }
        }
    ]
};
