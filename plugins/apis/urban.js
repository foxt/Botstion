const Discord = require("discord.js");
const url = require("url");
const fetch = require("node-fetch");


module.exports = {
    name: "Urban Dictionary",
    author: "theLMGN",
    version: 1,
    description: "Urban Dictionary lookup",
    commands: [
        {
            name: "urban",
            usage: "word[] word=\"Hello, world\"",
            description: "Urban Dictionary lookup",
            category: "Utilities",
            execute: async(c, msg, args) => {
                let r = await fetch(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(args.word)}`);
                let j = await r.json();
                if (j.error) {
                    return msg.reply({ embed: new Discord.MessageEmbed()
                        .setTitle(j.error)
                        .setAuthor("Urban Dictionary", "https://s2.mzstatic.com/us/r30/Purple/v4/dd/ef/75/ddef75c7-d26c-ce82-4e3c-9b07ff0871a5/mzl.yvlduoxl.png", "https://urbandictionary.com")
                        .setDescription("Urban Dictionary gave us an error")
                        .setColor("#da2204") });
                } else if (j.list.length < 1) {
                    return msg.reply({ embed: new Discord.MessageEmbed()
                        .setTitle("We can't find that!")
                        .setAuthor("Urban Dictionary", "https://s2.mzstatic.com/us/r30/Purple/v4/dd/ef/75/ddef75c7-d26c-ce82-4e3c-9b07ff0871a5/mzl.yvlduoxl.png", "https://urbandictionary.com")
                        .setDescription(`We had **0** results when we searched up **${args.word}**`)
                        .setColor("#da2204") });
                } else {
                    let s = j.list[0];
                    return msg.reply({ embed: new Discord.MessageEmbed().setTitle(s.full_title)
                        .setDescription(`${s.definition.replace(/\[/g, "").replace(/\]/g, "").substr(0, 1950)}`)
                        .setURL(s.permalink)
                        .setAuthor("Urban Dictionary", "https://s2.mzstatic.com/us/r30/Purple/v4/dd/ef/75/ddef75c7-d26c-ce82-4e3c-9b07ff0871a5/mzl.yvlduoxl.png", "https://urbandictionary.com")
                        .setTitle(s.word)
                        .addField("Example", s.example.replace(/\[/g, "").replace(/\]/g, "").substr(0, 1000))
                        .setColor("#da2204")
                    });
                }
            }
        }
    ]
};
