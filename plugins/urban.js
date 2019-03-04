const Discord = require("discord.js");
const url = require("url");
const snek = require("snekfetch");


module.exports = {
	name: "Urban Dictionary",
	author: "theLMGN",
	version: 1,
	description: "Urban Dictionary lookup",
	commands: [
		{
			name: "urban",
			usage: "word",
			description: "Urban Dictionary lookup",
			execute: async(c, msg, args) => {
				snek.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(args.join(" "))}`).then(async r => {
					if (r.body.list.length < 1) {
						return msg.reply({ embed: new Discord.MessageEmbed()
							.setTitle("We can't find that!")
							.setAuthor("Urban Dictionary","https://s2.mzstatic.com/us/r30/Purple/v4/dd/ef/75/ddef75c7-d26c-ce82-4e3c-9b07ff0871a5/mzl.yvlduoxl.png", "https://urbandictionary.com")
							.setDescription(`We had **0** results when we searched up **${args.join(" ")}**`)
							.setColor("#da2204") });
					} else {
						var s = r.body.list[0]
						msg.reply({ embed: new Discord.MessageEmbed().setTitle(s.full_title)
							.setDescription(`${s.definition.replace(/\[/g,"").replace(/\]/g,"")}`)
							.setURL(s.permalink)
							.setAuthor("Urban Dictionary","https://s2.mzstatic.com/us/r30/Purple/v4/dd/ef/75/ddef75c7-d26c-ce82-4e3c-9b07ff0871a5/mzl.yvlduoxl.png", "https://urbandictionary.com")
							.setTitle(s.word)
							.addField("Example",s.example.replace(/\[/g,"").replace(/\]/g,""))
							.setColor("#da2204"),
						});
					}
				});
			},
		},
	],
	events: [],
	timer: [],
};
